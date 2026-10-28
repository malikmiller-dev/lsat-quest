import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { build } from 'esbuild';

const manifest = [
  ...JSON.parse(fs.readFileSync('vendor/sources.json', 'utf8')),
  ...JSON.parse(fs.readFileSync('vendor/safari-sources.json', 'utf8')),
];
const checking = process.argv.includes('--check');
for (const source of manifest) {
  const file = path.join(
    'vendor',
    source.package,
    source.path === 'package.json' ? 'upstream-package.json' : source.path,
  );
  const bytes = fs.readFileSync(file);
  const gitHash = (data) =>
    crypto.createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex');
  if (gitHash(bytes) !== source.sha) throw new Error(`Upstream source hash mismatch: ${file}`);
}
for (const name of ['dexie', 'fake-indexeddb']) {
  const output = `vendor/${name}/dist/index.js`;
  const result = await build({
    entryPoints: [`vendor/${name}/src/index.ts`],
    outfile: output,
    write: false,
    bundle: true,
    format: 'esm',
    platform: name === 'dexie' ? 'browser' : 'node',
    target: 'es2022',
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.d.ts'],
    alias: { 'safari-14-idb-fix': path.resolve('vendor/safari-14-idb-fix/src/index.ts') },
    plugins: [
      {
        name: 'dexie-release-version',
        setup(build) {
          build.onLoad({ filter: /dexie[\\/]src[\\/]globals[\\/]constants\.ts$/ }, (args) => ({
            contents: fs.readFileSync(args.path, 'utf8').replace("'{version}'", "'4.4.7'"),
            loader: 'ts',
          }));
        },
      },
    ],
    sourcemap: false,
    legalComments: 'inline',
    banner: { js: `// Local source build. See vendor/${name}/LICENSE and vendor/README.md.` },
  });
  const built = Buffer.from(result.outputFiles[0].contents);
  if (checking) {
    for (const file of [output, `node_modules/${name}/dist/index.js`]) {
      if (!fs.readFileSync(file).equals(built))
        throw new Error(
          `Compiled dependency mismatch: ${file}. Rebuild and reinstall the local packages.`,
        );
    }
  } else {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, built);
  }
}
console.log(
  `Verified ${manifest.length} upstream files and ${checking ? 'checked' : 'built'} both vendored packages.`,
);
