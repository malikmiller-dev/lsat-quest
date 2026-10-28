# Pinned dependency source builds

Network access to npm is unavailable in this execution environment. These local packages are built from official, pinned GitHub source retrieved through the connected GitHub capability. They are not represented as the npm-published distributions.

| Package | Version | Source commit |
|---|---|---|
| Dexie | 4.4.7 | `da6b2b820f5514dd0ac73d773f7e99d4aeafc0a9` |
| fake-indexeddb (tests only) | 6.2.6 | `e4b7e016cf218f429db4819b0ff9a04741f15a25` |
| safari-14-idb-fix (bundled with Dexie) | 3.0.0 | `2a9084feb17a1226a5aed0fd3f3d3a49c5b3e9eb` |

Sources: https://github.com/dexie/Dexie.js/releases/tag/v4.4.7 and https://github.com/dumbmatter/fakeIndexedDB/releases/tag/v6.2.6.

`sources.json` records the upstream Git blob SHA for every retrieved source/license/type file. `scripts/build-vendor.mjs` verifies each hash before bundling. Original files remain unmodified; package metadata is adapted locally, and the compiled `dist/index.js` files are local esbuild outputs. Each package retains its upstream Apache-2.0 LICENSE and upstream package.json. The original source is included for attribution, inspection, and reproducibility. fake-indexeddb does not ship in the production application.

The additional Safari dependency comes from https://github.com/jakearchibald/safari-14-idb-fix and retains its Apache-2.0 license. Its hashes are in `safari-sources.json`. The build replaces Dexie's documented `{version}` placeholder with 4.4.7 and compiles its runtime constant enum from the declaration source, without modifying the original files.

Rebuild from the repository root with `npm run build:vendor`, then reinstall local packages. Project `.npmrc` uses `install-links=true` so local file packages are copied rather than symlinked. Switch to the equivalent registry packages and revalidate when normal dependency access returns. Do not apply repository formatting or lint fixes to upstream source.
