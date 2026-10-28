# Decisions

## 2026-10-28: Foundation dependency repair and cloud validation

The public repository is [malikmiller-dev/lsat-quest](https://github.com/malikmiller-dev/lsat-quest). This branch repairs foundation dependencies without merging the learning activity in [draft PR #1](https://github.com/malikmiller-dev/lsat-quest/pull/1).

Vite 7.3.7, Vitest 4.1.12 and compatible transitive fixes were installed with npm 11.6.0 without forced upgrades. At `f9da2af3f10918f44cb337d17b77c85419e8d3d4`, the [repair run](https://github.com/malikmiller-dev/lsat-quest/actions/runs/40765762878) passed the dependency audit with zero reported vulnerabilities, strict types, lint, 27 unit/DOM tests, build, formatting, and all seven Chromium browser tests. Tests cover four routes at five viewport widths, reload and theme persistence, keyboard/mobile navigation, unavailable lessons, blocked storage and production assets. This does not certify all dependencies as current or vulnerability-free.

GitHub Pages source is configured as GitHub Actions, confirmed through the signed-in owner settings. Deployment and hosted visual checks are the next steps; no successful deployment is claimed here. The temporary repair workflow is removed after its successful run. Main deployment continues to require audit and functional/browser validation. Local npm/browser restrictions persist; these passing results were executed in GitHub Actions. Run `npm ci` before testing locally against the new lockfile.

Slice 1 remains separate and provisional, with 71 unit/DOM and 11 browser tests passing on its own branch. Independent educational review and visual inspection remain pending before merging it. Preserve the existing private Sites preview and original Git history.

## Historical local milestone

## 2026-10-28: Static foundation and routing

Use React/TypeScript/Vite and `/lsat-quest/` base, with explicit hash routes. This satisfies static-host refresh without rewriting missing routes. References: [Vite Pages deployment](https://vite.dev/guide/static-deploy.html#github-pages), [GitHub custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## 2026-10-28: Offline environment exception

The host cannot resolve `registry.npmjs.org`. Use exact cached releases for a verifiable local milestone rather than uninstalled package declarations. This does **not** satisfy the requested current-stable-release gate. An online dependency/security review and upgrades are required before publication. Cached versions: React 19.2.0, Vite 7.2.2, TypeScript 5.9.3, Tailwind 4.1.16, Vitest 4.0.4. Current registry listings were checked through web retrieval, but installable current packages were unavailable to the executor. The local offline cache was copied outside the repo and its HTTP Accept-variation metadata normalized without modifying package bytes.

Vite's built-in TSX compilation is sufficient for this small app; no React refresh plugin is needed. Tailwind is compiled with its PostCSS plugin, while responsive semantic styles carry the interface. No remote fonts or assets are required.

## 2026-10-28: Browser test runtime

Use Python Playwright 1.55.0 because that package and matching Chromium binaries are installed. The npm Playwright package is not cached. Pin the Python dependency for CI. The application remains entirely TypeScript/React; Python is a test-only dependency. Reference: [Playwright Python CI](https://playwright.dev/python/docs/ci).

The local sandbox subsequently blocked browser execution: HTTP loopback raised WinError 10013, Python's asyncio socketpair stalled, and direct Node Playwright Chromium launch exited with code 3221225506 (0xC0000022). No browser or visual QA passed. Add React Testing Library/jsdom integration coverage for real DOM interactions, while retaining the required Playwright tests for an environment that permits browser execution. These DOM tests do not validate rendering, CSS responsiveness, or production HTTP behavior.

## 2026-10-28: No speculative learning records

Only appearance preferences are persisted now. IndexedDB/Dexie, export/restore, question attempts, and rewards belong together in Slice 1. No fake metrics or placeholder actions.

## 2026-10-28: Licensing

Keep source and future educational content without a redistribution grant until the owner chooses licensing. Avoid third-party copyrighted content entirely in this foundation. See CONTENT_POLICY.
