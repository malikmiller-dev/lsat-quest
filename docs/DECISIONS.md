# Decisions

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
