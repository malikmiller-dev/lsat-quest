import fs from 'node:fs';

const notices = fs.readFileSync('docs/THIRD_PARTY_NOTICES.md', 'utf8');
const sourceLicenses = ['dexie', 'safari-14-idb-fix'].map(
  (name) =>
    `\n\n## ${name} — upstream license\n\n${fs.readFileSync(`vendor/${name}/LICENSE`, 'utf8')}`,
);
fs.writeFileSync('public/third-party-notices.txt', notices + sourceLicenses.join(''));
