# Slice 1 implementation plan

## Objective and scope

Implement a complete local learning loop for necessary versus sufficient conditions on `feat/first-learning-quest`. Preserve the foundation on main. GitHub/public deployment and browser execution remain blocked; the user requested continued work, so proceed with local implementation and explicitly partial slice status rather than claiming those gates passed.

## User-visible functionality

Concise lesson, a four-case interactive conditional example, six original multiple-choice exercises, answer explanations, optional learner reasoning, durable attempt history, progress and one-time XP, JSON export and validated merge restore. Resume at the saved active exercise, with explicit next-exercise navigation. Incorrect attempts remain visible. All content is labeled AI-authored/provisional, with no independent expert review or official-LSAT claim.

## Architecture/data

Introduce a typed versioned content catalog, pure grading/progress/reward rules, Dexie/IndexedDB persistence, immutable attempts, unique reward IDs, and a validated backup schema. Write attempts and rewards in one transaction. Merge imports transactionally, reject conflicting identities and unsupported schemas, and never overwrite existing history silently. Preserve question versions in the content catalog and snapshot provenance/version in attempts.

## Dependencies

Dexie and fake-indexeddb are unavailable in the npm cache. Retrieve pinned official release source through the connected GitHub capability, preserve licenses and source hashes, and build local vendored packages with the existing compiler. This maintains offline reproducibility without a runtime CDN dependency. Replace with equivalent registry packages once normal package access is restored. Other cached dependencies still require the documented current-version/security gate.

## Tests/acceptance

Truth-table checks on original answer keys, content validation, grading and reward rules; transaction/concurrency/idempotency/rollback tests using real Dexie plus fake-indexeddb; backup round-trip, malformed/oversized/newer-schema/conflicting import tests; React integration tests for the learning loop and failures; existing type/lint/build/regression checks. Extend Playwright flows, but record browser checks as blocked until they can actually run.

## Risks and exclusions

Question content has internal logical consistency checks, not independent human review or calibrated difficulty. No AI inference, remote service, official material, spaced repetition, mastery prediction, or broader curriculum. Local data belongs to the browser origin; export reminders and explicit backup availability are required. Browser/visual QA and deployment remain open gates for both slices.
