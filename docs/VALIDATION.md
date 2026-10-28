# Validation record — Slice 0

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
