# Targeted dependency review

## 2026-10-28: Public source and passing cloud validation

The [public repository](https://github.com/malikmiller-dev/lsat-quest) preserves both original branches and commits without force-pushing. [Draft PR #1](https://github.com/malikmiller-dev/lsat-quest/pull/1) contains Slice 1; main retains the foundation. Origin is configured and local branches are synchronized with the published history.

At commit `8d95609ac5ef1ebf5ded029388e268dc9cd3d6e2`, the [dependency repair run](https://github.com/malikmiller-dev/lsat-quest/actions/runs/40764293202) passed on Ubuntu with Node 22.18.0, npm 11.6.0 and Python 3.13. Vite is now 7.3.7, Vitest 4.1.12, and compatible transitive fixes were installed with non-forced `npm audit fix`. The final audit reported **zero vulnerabilities**. Full vendor verification (185 hashes and compiled copies), strict types, zero-warning lint, **71 unit/DOM tests**, production build, formatting, and **all 11 Chromium browser tests** passed.

Browser coverage includes the full quest, reload, native backup download/restore, invalid-import preservation, missing IndexedDB, keyboard focus, mobile navigation, responsive widths, and cross-tab draft preservation. Automated layout assertions are not human visual or accessibility certification. No new hosted deployment was performed. The separate private Sites preview remains unchanged.

The original local network/browser restrictions persist; GitHub Actions supplied the online validation environment. The local installed node_modules are older than the repaired lockfile; reinstall with `npm ci` in a network-enabled environment before relying on local runs. Historical blocked results below describe earlier attempts, not the current cloud result.

Remaining release work: independently review provisional exercises, perform visual review, repair and validate foundation main's dependencies before Pages deployment, configure/verify Pages, and complete broader dependency/current-release review. npm audit is a time-specific registry result, not proof that all dependencies or vendored source are vulnerability-free. Do not advance Slice 2 or merge the draft solely on automated tests.

## Historical record (before public dependency repair)

Reviewed 2026-10-28. **Release gate remains open.** This is a targeted review of official advisories against the local lockfile, not a completed registry audit, current-version certification, penetration test or proof of an exploited deployment.

## Local evidence

`package-lock.json` pins Vite 7.2.2, Vitest and @vitest/mocker 4.0.4, Rollup 4.52.5, esbuild 0.25.11, React and react-dom 19.2.0. No `react-server-dom-*` or `@vitejs/plugin-rsc` packages were found. See [package.json](../package.json), [package-lock.json](../package-lock.json) and [vite.config.ts](../vite.config.ts).

The configuration binds Vite development/preview servers to 127.0.0.1. It does not enable Vitest Browser Mode, UI or API servers, or register standalone mocker/interceptor plugins. Tests use Node/jsdom; the separate Python Playwright suite targets a static production preview. The published app is a static build, not a hosted Vite development server. These are source observations, not a network exposure test of the developer's machine.

## Findings from maintainer advisories

| Component                              | Official advisory and affected range                                                                                                                                                                                                                                                                                                    | Assessment for this project                                                                                                                                                                                                                                                                                      |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vite 7.2.2                             | [GHSA-p9ff-h696-f583](https://github.com/vitejs/vite/security/advisories/GHSA-p9ff-h696-f583): dev-server WebSocket file read; Vite 7.0.0 through 7.3.1 affected, patched in 7.3.2.                                                                                                                                                     | Installed version matches. The advisory requires access to the dev-server WebSocket. Local loopback binding is observed; reachability/exploitability was not tested. This is a development-tool finding, not evidence of a file-read endpoint in the static test site.                                           |
| Vite 7.2.2 on Windows                  | [GHSA-fx2h-pf6j-xcff](https://github.com/vitejs/vite/security/advisories/GHSA-fx2h-pf6j-xcff): filesystem deny bypass; Vite 7.0.0 through 7.3.4 affected, patched in 7.3.5.                                                                                                                                                             | Installed version matches; this workspace uses Windows. The advisory also requires server access and particular filesystem/file-location conditions. Those conditions were not probed.                                                                                                                           |
| Vite 7.2.2, later fixes                | [GHSA-rq7h-c2jc-7f22](https://github.com/vitejs/vite/security/advisories/GHSA-rq7h-c2jc-7f22) and [GHSA-9jrq-w75r-8gcw](https://github.com/vitejs/vite/security/advisories/GHSA-9jrq-w75r-8gcw) include Vite 7.0.0 through 7.3.6, patched in 7.3.7.                                                                                     | The first requires non-Windows execution and matching imported/host paths; the second requires custom HTML-transform middleware conditions. The current Windows SPA setup does not establish either attack path. An update only to 7.3.2 or 7.3.5 would still leave the installed version in these later ranges. |
| Vitest / @vitest/mocker 4.0.4          | [GHSA-82fw-gwwq-j7x9](https://github.com/vitest-dev/vitest/security/advisories/GHSA-82fw-gwwq-j7x9): redirect-mock file read; affected 4.x versions below 4.1.11. The Windows fix bypass is covered by [GHSA-xp26-3454-mjgp](https://github.com/vitest-dev/vitest/security/advisories/GHSA-xp26-3454-mjgp), with the 4.x fix in 4.1.12. | Installed versions match the original advisory. Its unauthenticated path requires standalone mocker/interceptor plugin use; this project does not configure that path. Update the matching Vitest package family together, accounting for the follow-up fix.                                                     |
| React 19.2.0 server-component advisory | [React's official notice](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components) identifies the affected `react-server-dom-*` packages and excludes apps without a React server or RSC-capable framework/plugin.                                                                                 | The inspected app has no React server, RSC plugin or affected server packages. This particular advisory is not applicable to that architecture. This is not a blanket clearance of React or the dependency tree.                                                                                                 |

The cited patch versions are minimums for the selected advisories, not a recommendation to install those exact versions without a fresh release/security review. Broader runtime, transitive, Node, Python and CI-action reviews remain pending. Rollup, esbuild and the other packages listed above are inventoried, not cleared. Vendored source hashes establish byte provenance, not absence of vulnerabilities.

## Enforced CI check

`npm run audit:dependencies` runs `npm audit --audit-level=moderate --include=dev`. The validation workflow runs it immediately after `npm ci`, before tests/build and Pages artifact upload. Failure is not ignored. The existing deployment job requires that validation job. See [ci.yml](../.github/workflows/ci.yml) and [deploy.yml](../.github/workflows/deploy.yml).

The threshold includes moderate, high and critical reports; development dependencies are explicitly included. Low-severity findings still require review. npm documents that `audit-level` changes the failure threshold, not which findings are displayed, and that audit submits dependency metadata to the configured registry: [npm audit documentation](https://docs.npmjs.com/cli/v11/commands/npm-audit/). This command does not run `audit fix` or change the lockfile.

Keep `npm run check` available for functional validation without registry access. Passing it alone is not release approval. A failed or unavailable audit cannot be reported as a clean dependency scan, and this CI gate does not itself guard a separate manual Sites publication.

## Actual audit result and remaining work

The audit command with zero fetch retries and a 10-second fetch timeout exited 1: the registry bulk advisory endpoint failed with `getaddrinfo ENOTFOUND registry.npmjs.org`. No vulnerability count was returned. Dependency versions and lockfile were left unchanged; no patched installation or clean audit is claimed.

When registry access returns:

1. Review current supported releases and all reported direct/transitive advisories. For the selected Vite 7.x advisories, do not choose a version below 7.3.7; for the selected Vitest 4.x findings, account for the 4.1.12 follow-up fix. Recheck newer advisories rather than treating these as complete patch targets.
2. Update and install the selected compatible versions, regenerate the lockfile through npm, and review its diff. Do not use a forced bulk upgrade as a substitute for compatibility review.
3. Replace temporary source-built dependencies with suitable official packages when appropriate, retaining license notices and data compatibility.
4. Run the audit, full check, formatting check and all browser tests; review any remaining findings. Validate the build and all persistence/backup flows before publication.
5. Record installed versions, actual audit outcome and CI/deployment evidence. Keep independent educational review as its own gate.
