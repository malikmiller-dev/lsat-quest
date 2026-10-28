# Validation record - Slice 1, v0.2.1

## Private preview continuation

On 2026-10-28, Sites confirmed owner-only saved version 1 at [the private test URL](https://lsat-quest-v021-malik-test.yellowwren512.chatgpt.site/lsat-quest/), with deployment status `succeeded`. Exact IDs and pending functional checks are in [PREVIEW_ACCEPTANCE](PREVIEW_ACCEPTANCE.md). This is a separately hosted testing copy; no GitHub Pages deployment is claimed. Its source-byte equivalence has not been checked here.

The original local application remains unchanged at v0.2.1. The 71-test/build results below are retained from the implementation run, not represented as a new execution. This continuation rechecked GitHub lookup (404), CLI authentication (invalid old credential), npm registry access (ENOTFOUND), and browser-tool availability (no usable control tool). No new browser run or visual inspection occurred. `npm run format:check` and `git diff --check` passed for the documentation handoff.

## Application verification run

Run date: 2026-10-28. Node 22.18.0, npm 11.6.0, Python 3.13. Core dependencies still use the documented offline exception. The previous v0.2.0 milestone passed a clean offline npm ci; no dependencies changed in this repair.

| Check                                              | Actual result                                                                         |
| -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `npm run verify:vendor`                            | Passed: 185 upstream Git blob hashes and matching generated/installed compiled copies |
| `npm run typecheck`                                | Passed: strict TypeScript                                                             |
| `npm run lint`                                     | Passed: zero warnings                                                                 |
| `npm test`                                         | Passed: 6 files, 71 tests                                                             |
| `npm run build`                                    | Passed: production build, 42 transformed modules                                      |
| `npm run check`                                    | Passed: combined verification gate                                                    |
| `python -m py_compile e2e/browser_tests.py`        | Passed                                                                                |
| `npm run test:e2e`                                 | Setup failed: production preview did not become ready; 0 tests ran                    |
| `npm ping --fetch-retries=0 --fetch-timeout=10000` | Failed: ENOTFOUND for registry.npmjs.org                                              |
| `gh auth status`                                   | Failed: invalid local credential                                                      |
| Connected GitHub profile / repository lookup       | malikmiller-dev / requested repository returned 404                                   |
| Desktop/mobile visual inspection                   | Not executed                                                                          |
| GitHub Actions / Pages                             | Not executed / not deployed                                                           |

## Defects reproduced and fixed in this continuation

Before the repairs, the newly added regressions showed:

- Two individually valid 700-attempt backups with long notes could merge above 5 MiB. The import succeeded but the resulting history could not be exported.
- A new answer/reward, completion reward, or 10,001st attempt could move existing history outside the backup byte/count limits.
- A second database connection's saved answer replaced the first tab's open draft with feedback.
- Replacing the answer form after submission left keyboard focus on the document body.

The first targeted run failed six cases. After the fixes, all targeted cases and the full 71-test gate passed. The current tab's exercise selection also remains stable when another connection updates the shared resume point. These are tested database/DOM outcomes; browser behavior still needs verification.

## Passing coverage

- 16 navigation and 5 appearance cases.
- 8 foundation React cases for routing, focus, appearance recovery and roadmap.
- 26 content/database cases for formal answer keys, provenance, atomic attempts/rewards, idempotency, concurrency across independent connections, reopening, completion, backup validation/merge, conflicts and rollback.
- 4 capacity cases using actual size/count boundaries: oversized combined backups, answer/reward rollback, completion rollback, and refusing a 10,001st attempt. Every rejection leaves the prior export byte-for-byte unchanged.
- 12 quest React cases using the real store and fake-indexeddb: the full learning activity, incorrect attempts, literal-text notes, failure/retry, remount, missing storage, file preview/merge, Blob download, another connection's updates, draft retention, capacity messaging, and focus after submit/retry.

Source tests: [learning-capacity.test.ts](../src/data/learning-capacity.test.ts), [learning-store.test.ts](../src/data/learning-store.test.ts), [Quest.test.tsx](../src/app/Quest.test.tsx), plus existing foundation tests.

## Prepared browser coverage (not passed)

Eleven Playwright tests target the built application: deep links/reload, appearance reload/reopen, denied preference storage, keyboard navigation, mobile menu, six routes at five widths, base-path assets/unavailable features, full quest plus native download/restore into a fresh context, invalid import preserving history, missing IndexedDB, and two-tab draft preservation. The full quest also asserts focus after submission and retry.

The suite cannot reach the production preview on this host. Earlier diagnostics found WinError 10013 for loopback, an asyncio socketpair stall, and direct Chromium exit 3221225506 (0xC0000022). React/jsdom and fake-indexeddb do not prove real browser rendering, accessibility, persistence, native downloads or cross-tab behavior.

## Review limits

The educational content and schema remain unchanged. Internal formal audits do not establish independent educational review; all exercises stay provisional. No real learner records are in the repo.

No confirmed critical defect remains in the supported local test scope. Histories already exceeding the old v0.2.0 backup limits are not automatically repaired or truncated. Dependency security/current-stable review, browser/visual testing, authenticated GitHub publication, independent content review, and verified Pages deployment remain open gates.
