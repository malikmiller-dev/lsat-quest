# Slice 1 continuation: preserve drafts and exportable history

Scope: repair the existing local learning loop on `feat/first-learning-quest`. Do not expand the curriculum while publication, browser execution and independent content review remain blocked.

1. Reproduce an import whose two valid backups merge into a state exceeding the 5 MiB export limit. Reject any submission, completion or merge that would make the resulting history unsupported by the backup contract, atomically preserving the prior state. Surface a specific capacity message while retaining the draft.
2. Reproduce reactive updates from another database connection replacing the active exercise or an unsaved answer. Keep the current tab's exercise and answer draft stable, while continuing to show committed progress and retaining the stored resume point for a later visit.
3. Verify keyboard focus after submitting and retrying an answer, so replacing the form does not leave focus behind.
4. Add regression tests using the real store and fake-indexeddb, plus equivalent browser scenarios for the environment where Playwright can run. Run the complete check, formatting, and browser command; record actual results.
5. Commit the repairs, update progress/architecture/validation/changelog, and replace the source/build/history archive. Keep all external gates and provisional content status explicit.

Access recheck on 2026-10-28: the connected GitHub identity remains `malikmiller-dev`; the requested repository lookup returned 404. Local `gh auth status` still reports an invalid credential. npm ping fails with ENOTFOUND, and browser setup again ran zero tests because the production preview was unreachable.
