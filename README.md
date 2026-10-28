# LSAT Quest

An independently designed, local-first LSAT study companion, built one complete vertical slice at a time.

**Current milestone: Slice 1 local preview, v0.2.1.** A lesson on necessary/sufficient conditions, a four-case interactive example, six original provisional exercises, explanations, saved attempts and notes, one-time XP, progress, history, and validated backup/restore. This revision protects open drafts from another tab's updates, retains keyboard focus after submissions/retries, and rejects saves or merges that exceed backup limits. Slice 0 remains on local `main`; this work is on `feat/first-learning-quest`. Neither slice has completed all release gates. AI tutoring, wider curriculum, and official assessment are not implemented.

**Publication status: blocked, not deployed.** See [PROGRESS](docs/PROGRESS.md) for access limitations and verified results. No public repository or Pages URL has been created.

## Run locally

Requirements: Node >=22.12 (tested on 22.18.0), npm, Python 3.13 for browser tests.

```sh
npm ci
npm run dev
```

Open the printed `/lsat-quest/` URL. For the production preview:

```sh
npm run build
npm run preview
```

## Validate

```sh
npm run check
python -m pip install -r requirements-test.txt
python -m playwright install chromium
npm run test:e2e
```

`check` verifies vendored source/output hashes, strict types, ESLint, Vitest, and the production build. All 71 unit/database/DOM tests pass locally. Eleven browser tests are prepared for navigation, persistence, completion, backup downloads/restoration, storage failures, cross-tab drafts, keyboard focus, and layout at five widths, but none ran in this restricted environment. Ignored screenshots go under `test-results/`. Set `LSAT_BROWSER_PATH` only when intentionally using an installed compatible Chromium binary.

Dexie and test-only fake-indexeddb use pinned official source builds because npm access is blocked. See [vendor/README.md](vendor/README.md) for hashes, licenses, and rebuild instructions. Other packages use exact cached releases; review/update dependencies before publication.

## Publish after access is restored

The user authorized a public `lsat-quest` repository under the authenticated account `malikmiller-dev`. Recheck repository existence and CLI identity before creation or pushing. Do not overwrite existing work. Follow [DEPLOYMENT](docs/DEPLOYMENT.md).

Production uses `/lsat-quest/` as its base with hash navigation. PRs run validation. Main builds deploy only after validation and browser tests succeed. Workflow execution still needs verification on GitHub. Preserve main and submit this feature branch through a validated PR.

## Content and privacy

No official questions, copied proprietary assets, credentials, analytics trackers, or real study records are included. All six exercises are AI-authored, original, and clearly provisional; formal consistency checks are not independent educational review. See [CONTENT_REVIEW](docs/CONTENT_REVIEW.md).

Study records stay in this browser's IndexedDB. Export JSON from Settings before clearing site data or changing browsers. Restore merges without deleting existing history or duplicating rewards. Notes are saved only on submission. Appearance is a separate localStorage preference. Backups must never be committed. Original code, artwork, and educational text have no project-wide redistribution license yet; dependencies retain their licenses. See [CONTENT_POLICY](docs/CONTENT_POLICY.md).

## Continue development

Read [AGENTS.md](AGENTS.md), [ARCHITECTURE](docs/ARCHITECTURE.md), [PROGRESS](docs/PROGRESS.md), and [ROADMAP](docs/ROADMAP.md). Finish browser/visual verification, dependency review, independent content review, GitHub publication, and deployment before expanding to Slice 2.
