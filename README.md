# LSAT Quest

An independently designed, local-first LSAT study companion, built one complete vertical slice at a time.

**Current milestone: Slice 0 foundation.** Four working views, responsive navigation, dark/light appearance saved in the browser, and a configured GitHub Actions validation/Pages pipeline. Lessons, questions, XP, study records, AI, and official assessment are **not implemented**.

**Publication status: public source; foundation cloud checks pass; Pages deployment pending.** See [PROGRESS](docs/PROGRESS.md) for current release status and verified test results. Do not assume a Pages URL exists from the intended repository name.

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

`check` runs strict type checking, ESLint, Vitest, and the production build. Browser tests launch the production preview, exercise keyboard/mobile navigation, persistence and blocked storage, check all routes at five widths, and stop the owned preview afterward. They generate ignored screenshots under `test-results/`. Set `LSAT_BROWSER_PATH` only when intentionally using an already installed compatible Chromium binary.

## Publication

The [public repository](https://github.com/malikmiller-dev/lsat-quest) preserves the original history. [Foundation validation](https://github.com/malikmiller-dev/lsat-quest/actions/runs/40765762878) passed 27 unit/DOM tests, all seven browser tests, types/lint/build/formatting and the dependency audit (zero reported vulnerabilities). Vite is 7.3.7 and Vitest 4.1.12 with compatible transitive fixes.

Pages is configured for GitHub Actions. Main deploys only after audit and functional/browser checks; deployment/hosted inspection remain pending. See [DEPLOYMENT](docs/DEPLOYMENT.md). The learning activity lives separately in [draft PR #1](https://github.com/malikmiller-dev/lsat-quest/pull/1) pending independent content and visual review.

## Content and privacy

No official questions, copied proprietary assets, credentials, analytics trackers, or personal study records are included. Only an appearance setting is stored in this release. The learning path is explicitly a preview. Original geometric artwork and interface code are created for this project. Third-party dependencies retain their own licenses; no project-wide redistribution license has yet been granted. See [CONTENT_POLICY](docs/CONTENT_POLICY.md).

## Continue development

Read [AGENTS.md](AGENTS.md), [ARCHITECTURE](docs/ARCHITECTURE.md), [PROGRESS](docs/PROGRESS.md), and [ROADMAP](docs/ROADMAP.md). Slice 1 is the first complete educational loop: necessary/sufficient conditions, exercises, reasoning feedback, attempts, one-time XP, and validated export/restore.
