# Validation record — Slice 0

## 2026-10-28: Foundation dependency repair and cloud validation

The public repository is [malikmiller-dev/lsat-quest](https://github.com/malikmiller-dev/lsat-quest). This branch repairs foundation dependencies without merging the learning activity in [draft PR #1](https://github.com/malikmiller-dev/lsat-quest/pull/1).

Vite 7.3.7, Vitest 4.1.12 and compatible transitive fixes were installed with npm 11.6.0 without forced upgrades. At `f9da2af3f10918f44cb337d17b77c85419e8d3d4`, the [repair run](https://github.com/malikmiller-dev/lsat-quest/actions/runs/40765762878) passed the dependency audit with zero reported vulnerabilities, strict types, lint, 27 unit/DOM tests, build, formatting, and all seven Chromium browser tests. Tests cover four routes at five viewport widths, reload and theme persistence, keyboard/mobile navigation, unavailable lessons, blocked storage and production assets. This does not certify all dependencies as current or vulnerability-free.

GitHub Pages source is configured as GitHub Actions, confirmed through the signed-in owner settings. Deployment and hosted visual checks are the next steps; no successful deployment is claimed here. The temporary repair workflow is removed after its successful run. Main deployment continues to require audit and functional/browser validation. Local npm/browser restrictions persist; these passing results were executed in GitHub Actions. Run `npm ci` before testing locally against the new lockfile.

Slice 1 remains separate and provisional, with 71 unit/DOM and 11 browser tests passing on its own branch. Independent educational review and visual inspection remain pending before merging it. Preserve the existing private Sites preview and original Git history.

## Historical local milestone

Run date: 2026-10-28. Local Node 22.18.0, npm 11.6.0, Python 3.13. Cached dependencies are locked in package-lock.json; current dependency installation/security review remains blocked.

| Check                                    | Actual result                                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| `npm run typecheck`                      | Passed, strict TypeScript                                                                |
| `npm run lint`                           | Passed, zero warnings                                                                    |
| `npm test`                               | Passed: 3 files, 27 tests                                                                |
| `npm run build`                          | Passed: 33 transformed modules, static `dist/` produced                                  |
| `npm run check`                          | Passed: complete combined gate after integration-test fixes                              |
| `npm run test:e2e`                       | Blocked during setup; 0 browser tests ran                                                |
| Direct HTTP preview request              | Blocked: WinError 10013 on loopback socket connection                                    |
| Python Playwright bootstrap diagnosis    | Timed out inside asyncio socketpair creation; bounded diagnostic exited after 15 seconds |
| Direct Node Playwright launch            | Failed: Chromium process exited 3221225506 (0xC0000022)                                  |
| Desktop/mobile screenshots and visual QA | Not executed; no screenshots were produced                                               |
| GitHub Actions                           | Not executed; repository publication blocked                                             |
| GitHub Pages                             | Not deployed, not verified                                                               |

## Test coverage that passed

- 14 route-parser cases: overview aliases, supported fragment routes, and unknown/malicious-looking fragments.
- 5 persistence cases: default, saved light preference, corrupt preference, round-trip changes, read/write failures.
- 8 React integration cases: real rendered navigation, primary-action routing/focus, remount persistence, write failure, read failure, not-found recovery, menu Escape/focus, truthful roadmap states.

## Browser suite prepared but unverified

Seven Playwright tests target the production build: navigation/deep-link refresh, theme reload/reopen, denied storage, keyboard skip link, mobile menu, all four routes at widths 320/390/768/1024/1440, and base-path assets/unavailable controls. No passed browser result is implied by their presence.

## Review limits

No learning content or official test format was implemented, so educational question review is not claimed. SVG/CSS artwork is original. No real learner data is present. No confirmed defect remained in the executed unit/DOM scope; rendering, browser persistence, and hosted behavior still require verification. Network security audit could not run. The older cached package set must be reviewed and updated before publication.
