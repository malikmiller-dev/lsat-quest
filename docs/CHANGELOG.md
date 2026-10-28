# Changelog

## 2026-10-28: Public source and passing cloud validation

The [public repository](https://github.com/malikmiller-dev/lsat-quest) preserves both original branches and commits without force-pushing. [Draft PR #1](https://github.com/malikmiller-dev/lsat-quest/pull/1) contains Slice 1; main retains the foundation. Origin is configured and local branches are synchronized with the published history.

At commit `8d95609ac5ef1ebf5ded029388e268dc9cd3d6e2`, the [dependency repair run](https://github.com/malikmiller-dev/lsat-quest/actions/runs/40764293202) passed on Ubuntu with Node 22.18.0, npm 11.6.0 and Python 3.13. Vite is now 7.3.7, Vitest 4.1.12, and compatible transitive fixes were installed with non-forced `npm audit fix`. The final audit reported **zero vulnerabilities**. Full vendor verification (185 hashes and compiled copies), strict types, zero-warning lint, **71 unit/DOM tests**, production build, formatting, and **all 11 Chromium browser tests** passed.

Browser coverage includes the full quest, reload, native backup download/restore, invalid-import preservation, missing IndexedDB, keyboard focus, mobile navigation, responsive widths, and cross-tab draft preservation. Automated layout assertions are not human visual or accessibility certification. No new hosted deployment was performed. The separate private Sites preview remains unchanged.

The original local network/browser restrictions persist; GitHub Actions supplied the online validation environment. The local installed node_modules are older than the repaired lockfile; reinstall with `npm ci` in a network-enabled environment before relying on local runs. Historical blocked results below describe earlier attempts, not the current cloud result.

Remaining release work: independently review provisional exercises, perform visual review, repair and validate foundation main's dependencies before Pages deployment, configure/verify Pages, and complete broader dependency/current-release review. npm audit is a time-specific registry result, not proof that all dependencies or vendored source are vulnerability-free. Do not advance Slice 2 or merge the draft solely on automated tests.

## Historical record (before public dependency repair)

## 2026-10-28 - Dependency audit gate (local CI change)

- Added `npm run audit:dependencies`, including development packages and failing for reported vulnerabilities at moderate severity or higher.
- Required that audit in the GitHub validation job before tests/build and Pages artifact upload; failures are not ignored.
- Reviewed selected official advisories against installed versions/configuration. Recorded unresolved Vite/Vitest version matches, conditional exposure and minimum fixes for those specific advisories.
- Registry audit failed with ENOTFOUND. No package upgrade, clean scan or new deployment is claimed. Application version remains 0.2.1.

## 2026-10-28 - Private preview handoff (documentation only)

- Confirmed the existing owner-only Sites deployment of v0.2.1, saved version 1, and recorded exact publication/source IDs.
- Corrected the earlier blanket "not deployed" status while retaining the blocked public GitHub/Pages release status.
- Added a browser acceptance checklist with synthetic-record counts, backup/restore, resume, cross-tab, keyboard, mobile and visual checks; none are reported passed without execution.
- Documented export/restore when moving between the test address and a future Pages address. No application, data-schema, dependency or educational-content changes; application version remains 0.2.1.

## 0.2.1 - 2026-10-28 - Local reliability fixes (unpublished)

- Fixed saves, completions and imports that could create a history too large to export. Capacity validation now runs before commit; rejected operations preserve all previous records and rewards.
- Fixed reactive updates from another connection replacing an open answer draft or changing the current exercise. Committed progress still updates and the saved resume point still applies on a later visit.
- Restored keyboard focus after answer submission and retry. Added specific backup-limit messages without discarding the draft.
- Added nine regression tests, bringing the suite to 71 passing tests in six files; verified reward idempotency across independent database connections.
- Expanded the prepared browser suite to 11 tests, including cross-tab drafts and feedback focus. Browser setup still ran zero tests. GitHub authentication, npm DNS, independent content review and publication gates remain unresolved.

## 0.2.0 - 2026-10-28 - First quest local milestone (unpublished)

- Added a necessary/sufficient lesson, four-case interactive rule, and six original versioned provisional exercises with answer-choice explanations.
- Added answer submission, optional notes, retained wrong attempts, persistent session selection, history, activity-based progress, and one-time XP awards.
- Added Dexie schema 1, atomic attempt/reward writes, and validated transactional merge backups with duplicate/conflict protection.
- Added storage loading/retry states, save failure recovery, and real JSON download/import controls.
- Added 35 tests for content logic, database integrity, backup merging, missing storage, and the full React learning flow; 62 total tests pass. Expanded the browser suite from 7 to 10 tests, still blocked before execution.
- Added pinned, licensed official-source dependency builds with 185 verified source hashes and deterministic compiled-output checks. Production includes dependency license notices.
- Content remains provisional; independent review, browser/visual verification, current dependency review, GitHub publication, and deployment remain pending. Main is preserved; this work is on a feature branch.

## 0.1.0 — 2026-10-28 — Local foundation milestone (unpublished)

- Added the LSAT Quest app shell, four views, original interface identity, responsive CSS, and mobile navigation.
- Added persisted appearance, keyboard focus management, storage-failure recovery, and unknown-route handling.
- Added 27 passing unit/React integration tests and seven production-browser tests awaiting execution.
- Added strict type/lint/build checks, a lockfile, reusable CI, and gated GitHub Pages deployment configuration.
- Added architectural, licensing, content, roadmap, validation, and continuation documentation.
- Publication/current-dependency/browser gates remain blocked; this is not a completed public release.
