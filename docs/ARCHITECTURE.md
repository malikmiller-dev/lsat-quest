# Architecture

## Runtime and views

React, strict TypeScript, Vite, Tailwind tokens/semantic CSS, and hash routes under `/lsat-quest/`. The output is static; no server, account, external API, or AI inference is required.

- `app/App.tsx`: shell, overview/path/roadmap/settings.
- `app/StudyContext.tsx`: injected database service, reactive snapshots, loading/error/retry. Explicit database opening detects unavailable IndexedDB before subscribing.
- `app/Quest.tsx`: lesson, interactive example, submissions and feedback.
- `app/History.tsx`: reproducible versioned attempts and submitted notes.
- `app/Backups.tsx`: export, validation preview, explicit merge action.
- `domain/learning.ts`: questions, provenance, progress/reward policy, finite-model content checks.
- `domain/backup.ts`: strict schema/relationship validation and conflict-aware merge.
- `data/learning-store.ts`: all learning persistence and transactions.
- `services/appearance.ts`: recoverable localStorage preference.
- `content/conditional-v1.json`: immutable original exercise version 1.
- `vendor/`: pinned official-source Dexie/fake-indexeddb/Safari fix; see its README.
- `scripts/`: source/build integrity verification and production license notices.

## Persistence

`localStorage['lsat-quest:appearance:v1']` stores dark/light separately from study backups.

Dexie database `lsat-quest-learning`, schema version 1:

| Table    | Key and purpose                                                                                                                          |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| attempts | Submission UUID; question ID/version, choice, optional reasoning, result, timestamp, review status. Never overwrite a different attempt. |
| sessions | Lesson/version ID; start, active exercise, optional completion time.                                                                     |
| rewards  | Deterministic event ID; amount, supporting attempt/lesson ID, award time.                                                                |

A read snapshot spans all three tables. Submission and its first-correct reward commit in one write transaction. Retrying the identical submission ID is idempotent; mismatched data for that ID is rejected. Timestamps are monotonic within this database even under a repeated or backward-moving device clock. Completion and its one-time reward are also atomic. UI feedback follows successful persistence.

Reactive queries reflect committed records. The service owns database operations; UI state holds only drafts and action status. Unsubmitted choices/notes are deliberately not autosaved.

## Backup contract

Schema 1 JSON contains a format marker, export timestamp, and all three tables. Validate keys, record limits, dates, known question versions, grades against versioned keys, unique IDs, event-to-reward relationships, and completion evidence before mutation.

Restore merges attempts by ID, rejects conflicting copies, retains existing active exercise, takes the earliest session start/completion, and deduplicates rewards by educational event. Revalidate the merged state, then write everything in one transaction. Read/validation/write failures leave existing study records intact. Empty backups are valid. No deletion or replacement of history occurs.

Supported backup limit: 5 MiB / 10,000 attempts. Oversized exports fail visibly without modifying records. Future versions need explicit migrations and retained question versions; never reinterpret old attempts against changed answer keys.

## Content and rewards

All six exercises share the provenance in `domain/learning.ts` and the ledger in CONTENT_REVIEW. They remain provisional until independent review. Internal finite-model checks verify the encoded formal statements, not educational quality or accurate translation from prose.

10 XP once per first correct question/version and 20 once per completed lesson/version. Current maximum 80. No inferred mastery, calibrated difficulty, time estimate based on performance, or predicted LSAT score.

## Build and hosting

`npm run check` verifies all 185 upstream blob hashes and reproducible compiled dependencies, types, lint, tests, then builds. `build-notices.mjs` includes runtime dependency licenses in the deployable artifact. fake-indexeddb is test-only.

CI runs unit/DOM and production-browser tests. Only a validated main artifact can deploy. Browser execution and Pages are still unverified due environment restrictions; see VALIDATION. Keep feature work on its branch until release gates pass.
