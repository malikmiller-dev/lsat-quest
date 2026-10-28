# LSAT Quest

An independently designed, local-first LSAT study companion, built one complete vertical slice at a time.

**Current milestone: Slice 1 draft preview, v0.2.1.** A lesson on necessary/sufficient conditions, a four-case interactive example, six original provisional exercises, explanations, saved attempts and notes, one-time XP, progress, history, and validated backup/restore. This revision protects open drafts from another tab's updates, retains keyboard focus after submissions/retries, and rejects saves or merges that exceed backup limits. Slice 0 remains on `main`; this work is on `feat/first-learning-quest`. Neither slice has completed all release gates. AI tutoring, wider curriculum, and official assessment are not implemented.

**Private test preview deployed:** [Open LSAT Quest v0.2.1](https://lsat-quest-v021-malik-test.yellowwren512.chatgpt.site/lsat-quest/). Owner-only deployment is confirmed. Functional browser/visual checks remain pending; use the [preview acceptance checklist](docs/PREVIEW_ACCEPTANCE.md). Source is public in [GitHub](https://github.com/malikmiller-dev/lsat-quest), with [draft PR #1](https://github.com/malikmiller-dev/lsat-quest/pull/1). Pages deployment remains pending. See [PROGRESS](docs/PROGRESS.md).

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
npm run audit:dependencies
python -m pip install -r requirements-test.txt
python -m playwright install chromium
npm run test:e2e
```

`check` verifies vendored source/output hashes, strict types, ESLint, Vitest, and the production build. [GitHub Actions](https://github.com/malikmiller-dev/lsat-quest/actions/runs/40764293202) passed all 71 unit/DOM tests and all 11 browser tests on repaired commit `8d95609`, including reload, backup restore, keyboard/mobile navigation and cross-tab behavior. The dependency audit reported zero vulnerabilities. See [VALIDATION](docs/VALIDATION.md) for scope and remaining review gates. Local installed dependencies require `npm ci` after updating the lockfile.

Dexie and test-only fake-indexeddb retain pinned official source builds; see [vendor/README.md](vendor/README.md) for provenance and licenses. Vite 7.3.7, Vitest 4.1.12 and compatible transitive fixes are locked. Audit results do not replace broader security/current-version review.

## Publication status

The public repository preserves the original source history. Slice 1 remains in a draft PR; main retains the foundation and needs a separate dependency repair before Pages. Production uses `/lsat-quest/` with hash navigation. CI requires audit, functional and browser checks before publishing a main artifact. See [DEPLOYMENT](docs/DEPLOYMENT.md). Independent educational review and visual inspection remain pending; no Pages deployment is claimed.

## Content and privacy

No official questions, copied proprietary assets, credentials, analytics trackers, or real study records are included. All six exercises are AI-authored, original, and clearly provisional; formal consistency checks are not independent educational review. See [CONTENT_REVIEW](docs/CONTENT_REVIEW.md).

Study records stay in this browser's IndexedDB. Export JSON from Settings before clearing site data or changing browsers. Restore merges without deleting existing history or duplicating rewards. Notes are saved only on submission. Appearance is a separate localStorage preference. Backups must never be committed. Original code, artwork, and educational text have no project-wide redistribution license yet; dependencies retain their licenses. See [CONTENT_POLICY](docs/CONTENT_POLICY.md).

## Continue development

Read [AGENTS.md](AGENTS.md), [ARCHITECTURE](docs/ARCHITECTURE.md), [PROGRESS](docs/PROGRESS.md), and [ROADMAP](docs/ROADMAP.md). Finish visual verification, broader dependency review, independent content review, and deployment before expanding to Slice 2.
