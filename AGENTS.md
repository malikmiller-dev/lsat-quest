# LSAT Quest agent instructions

## Mission

Build an independently designed, gamified, local-first LSAT study application in small, complete vertical slices. Preserve working systems. Never simulate study progress, AI tutoring, reviews, or deployment success.

## Resume

Read this file, docs/ARCHITECTURE.md, docs/ROADMAP.md, docs/PROGRESS.md, docs/DECISIONS.md, recent Git history, relevant source, and tests before changing anything. Continue the immediate next task in PROGRESS. The user authorized public GitHub publication to `malikmiller-dev/lsat-quest`, main as stable, feature branches for later slices, GitHub Actions and Pages.

## Architecture and code

React + strict TypeScript + Vite, Tailwind design tokens and CSS, simplest sufficient state. Static GitHub Pages target with base `/lsat-quest/`; use hash routes for refresh support. Put business rules in domain/services, not repeated UI code. Add Dexie for learning records in Slice 1; version data and validate import before mutation. No secrets in source or frontend bundles. No server-side runtime in Pages. Avoid empty speculative modules.

## Educational content

No copied official LSAT questions or proprietary assets. Keep source, license, question version, review status, and original/official provenance explicit. AI-authored material is provisional until appropriate review; model agreement is not independent human approval. Preserve wrong attempts. Reward each eligible educational event at most once. Do not predict LSAT scores or invent difficulty calibration. Confirm official exam formats at the relevant slice from LSAC; do not treat a roadmap date as verified exam policy.

## Validation and completion

Specify a slice plan before implementing. Run `npm run check` and `npm run test:e2e`. Cover new critical flows and regression risks; inspect desktop and mobile. Review accessibility, data integrity, licensing, and unavailable states. Failed builds must not deploy. Commit conventional messages; never force-push. Later slices use focused feature branches and PR checks before merging. Verify the actual deployment and record evidence; report exact blockers where unavailable.

## Persistence of project memory

Update PROGRESS, ROADMAP, CHANGELOG, and DECISIONS when relevant. Record completed work, executed commands/results, actual commits and deployment status, known defects, next task, and blockers. Never declare the overall product complete while only the foundation exists.

## Privacy and licensing

Keep credentials, private files, personal study records, exports, and downloaded reference content out of Git. The supplied implementation prompt remains outside this repo. Source has no redistribution license granted yet; dependencies retain their licenses. Record any future licensing decision explicitly.
