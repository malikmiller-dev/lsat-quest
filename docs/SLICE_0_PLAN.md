# Slice 0 implementation plan

## Objective

Create a usable, responsive application foundation and prepare automated GitHub Pages deployment.

## User-visible functionality

Overview, learning-path preview, complete roadmap, settings, dark/light appearance, mobile navigation, keyboard skip link, and a recoverable unknown-route page. Unavailable study features have explicit labels and no fake completion controls.

## Changes and data

React/TypeScript/Vite application, reusable icons and design tokens, hash navigation under `/lsat-quest/`, versioned local appearance preference. No study records or user account data in this slice.

## Dependencies

React, Vite, TypeScript, Tailwind, ESLint, Vitest, Playwright. Node >=22.12. Current releases must be reviewed before publication; cached versions are used for the blocked-network local milestone and recorded in DECISIONS.

## Acceptance and tests

- Typecheck, lint, unit tests, production build.
- Browser navigation, direct hash-route reload, dark/light persistence, storage denial recovery, mobile menu/Escape, keyboard access, asset loading, and overflow checks.
- No runtime errors in the production preview.
- Commit source and verify GitHub publication/Pages when access is available.

## Risks and current access

The authenticated connector identifies `malikmiller-dev`; no matching repository was returned in its account repository list. CLI authentication is invalid. Connector tools do not expose repository creation or Pages configuration. Browser automation failed to initialize. Registry DNS is unavailable. These are publication/dependency-update blockers, not evidence of deployment.

## Out of scope

Lessons, questions, attempts, XP, Dexie, AI, official test content, analytics, auth, and backend services. Slice 1 starts only after the Slice 0 foundation passes its gates and publication access is restored.
