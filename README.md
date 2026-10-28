# LSAT Quest

An independently designed, local-first LSAT study companion, built one complete vertical slice at a time.

**Current milestone: Slice 0 foundation.** Four working views, responsive navigation, dark/light appearance saved in the browser, and a configured GitHub Actions validation/Pages pipeline. Lessons, questions, XP, study records, AI, and official assessment are **not implemented**.

**Publication status: blocked, not deployed.** See [PROGRESS](docs/PROGRESS.md) for exact access limitations and verified test results. Do not assume a Pages URL exists from the intended repository name.

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

## Publish after access is restored

The user authorized a public `lsat-quest` repository under their authenticated account `malikmiller-dev`. Recheck repository existence and CLI identity before running any create/push command. Do not overwrite existing work. Instructions are in [DEPLOYMENT](docs/DEPLOYMENT.md).

Production uses `/lsat-quest/` as its base and hash navigation to keep direct links refreshable on static hosting. Pull requests run validation. Pushes to `main` run validation and upload the checked build before a separate dependent job deploys it. A validation failure prevents deployment. Workflow execution still needs verification on GitHub.

## Content and privacy

No official questions, copied proprietary assets, credentials, analytics trackers, or personal study records are included. Only an appearance setting is stored in this release. The learning path is explicitly a preview. Original geometric artwork and interface code are created for this project. Third-party dependencies retain their own licenses; no project-wide redistribution license has yet been granted. See [CONTENT_POLICY](docs/CONTENT_POLICY.md).

## Continue development

Read [AGENTS.md](AGENTS.md), [ARCHITECTURE](docs/ARCHITECTURE.md), [PROGRESS](docs/PROGRESS.md), and [ROADMAP](docs/ROADMAP.md). Slice 1 is the first complete educational loop: necessary/sufficient conditions, exercises, reasoning feedback, attempts, one-time XP, and validated export/restore.
