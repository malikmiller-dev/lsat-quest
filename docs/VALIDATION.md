# Validation record - Slice 1

Run date: 2026-10-28. Node 22.18.0, npm 11.6.0, Python 3.13. Core dependency installation/security review still uses the documented offline exception. A clean `npm ci --offline --cache ../work/npm-cache --no-audit --no-fund` reinstalled all 323 packages successfully, and the combined gate passed afterward. The cache path is local to this workspace; normal environments should use `npm ci`.

| Check                                       | Actual result                                                                       |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| Offline npm install                         | Passed with pinned source-build packages and install-links=true                     |
| Dexie smoke test with fake-indexeddb        | Passed: create, write, read, delete; reports 4.4.7                                  |
| `npm run verify:vendor`                     | Passed: 185 upstream Git blob hashes; generated and installed compiled copies match |
| `npm run typecheck`                         | Passed: strict TypeScript                                                           |
| `npm run lint`                              | Passed: zero warnings                                                               |
| `npm test`                                  | Passed: 5 files, 62 tests                                                           |
| `npm run build`                             | Passed: static production build, 42 transformed modules                             |
| `npm run check`                             | Passed: combined verification gate                                                  |
| `python -m py_compile e2e/browser_tests.py` | Passed                                                                              |
| `npm run test:e2e`                          | Setup failed: production preview did not become ready; 0 tests ran                  |
| Desktop/mobile visual inspection            | Not executed; no verified screenshots                                               |
| GitHub Actions / Pages                      | Not executed / not deployed                                                         |

## Passing coverage

- 16 route cases and 5 appearance cases.
- 8 foundation React integration cases for routing, focus, appearance recovery and roadmap.
- 25 content/database cases: each exercise has one formally supported answer; provisional provenance; correct/incorrect attempts; monotonic retry order; duplicate/concurrent submissions; one-time completion; rollback on reward failure; database reopen; invalid submissions; full backup round trip; merged histories; tampered grade/reward/version/status/completion/duplicates/fields; ID conflicts; atomic import rollback; malformed/oversized/unsupported JSON.
- 8 quest React integration cases using the actual database service with fake-indexeddb: all four interactive rule cases; full six-question activity including a wrong answer and literal-text notes; save failure/retry; interrupted-session remount; query failure/retry; truly unavailable IndexedDB; backup preview/merge/invalid file; real Blob download request.

The tests revealed and fixed an endless loading state when IndexedDB is missing: explicitly opening the database now produces a retryable error. An explicit status role on feedback was replaced with an ARIA live heading so heading semantics are retained.

## Prepared browser coverage (not passed)

Ten Playwright tests target the built application: deep links/reload, appearance reload/reopen, denied preference storage, keyboard navigation, mobile menu, six routes at five widths, base-path assets/unavailable features, full quest plus native download/restore into a fresh browser context, invalid import preserving history, and missing IndexedDB.

The suite cannot reach the production preview on this host. Earlier diagnostics found WinError 10013 for loopback, an asyncio socketpair stall, and direct Chromium exit 3221225506 (0xC0000022). React/jsdom and fake-indexeddb results do not prove real browser rendering, accessibility, persistence, native download handling, or cross-tab behavior.

## Review limits

No official exam-format claims or copied test material are included. Formal exercise audits check the authored formal model only. Prose ambiguity, pedagogy and independent expert review remain open; see CONTENT_REVIEW. No real learner records are in the repo.

No confirmed critical defect remains in the executed scope. Dependency security review/current-stable upgrades, visual/browser testing, authenticated GitHub publishing, and verified Pages deployment remain release gates.
