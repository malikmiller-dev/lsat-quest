# Changelog

## 2026-10-28: Foundation dependency repair and cloud validation

The public repository is [malikmiller-dev/lsat-quest](https://github.com/malikmiller-dev/lsat-quest). This branch repairs foundation dependencies without merging the learning activity in [draft PR #1](https://github.com/malikmiller-dev/lsat-quest/pull/1).

Vite 7.3.7, Vitest 4.1.12 and compatible transitive fixes were installed with npm 11.6.0 without forced upgrades. At `f9da2af3f10918f44cb337d17b77c85419e8d3d4`, the [repair run](https://github.com/malikmiller-dev/lsat-quest/actions/runs/40765762878) passed the dependency audit with zero reported vulnerabilities, strict types, lint, 27 unit/DOM tests, build, formatting, and all seven Chromium browser tests. Tests cover four routes at five viewport widths, reload and theme persistence, keyboard/mobile navigation, unavailable lessons, blocked storage and production assets. This does not certify all dependencies as current or vulnerability-free.

GitHub Pages source is configured as GitHub Actions, confirmed through the signed-in owner settings. Deployment and hosted visual checks are the next steps; no successful deployment is claimed here. The temporary repair workflow is removed after its successful run. Main deployment continues to require audit and functional/browser validation. Local npm/browser restrictions persist; these passing results were executed in GitHub Actions. Run `npm ci` before testing locally against the new lockfile.

Slice 1 remains separate and provisional, with 71 unit/DOM and 11 browser tests passing on its own branch. Independent educational review and visual inspection remain pending before merging it. Preserve the existing private Sites preview and original Git history.

## Historical local milestone

## 0.1.0 — 2026-10-28 — Local foundation milestone (unpublished)

- Added the LSAT Quest app shell, four views, original interface identity, responsive CSS, and mobile navigation.
- Added persisted appearance, keyboard focus management, storage-failure recovery, and unknown-route handling.
- Added 27 passing unit/React integration tests and seven production-browser tests awaiting execution.
- Added strict type/lint/build checks, a lockfile, reusable CI, and gated GitHub Pages deployment configuration.
- Added architectural, licensing, content, roadmap, validation, and continuation documentation.
- Publication/current-dependency/browser gates remain blocked; this is not a completed public release.
