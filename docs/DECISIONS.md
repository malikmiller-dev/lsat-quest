# Decisions

## 2026-10-28: Public source and passing cloud validation

The [public repository](https://github.com/malikmiller-dev/lsat-quest) preserves both original branches and commits without force-pushing. [Draft PR #1](https://github.com/malikmiller-dev/lsat-quest/pull/1) contains Slice 1; main retains the foundation. Origin is configured and local branches are synchronized with the published history.

At commit `8d95609ac5ef1ebf5ded029388e268dc9cd3d6e2`, the [dependency repair run](https://github.com/malikmiller-dev/lsat-quest/actions/runs/40764293202) passed on Ubuntu with Node 22.18.0, npm 11.6.0 and Python 3.13. Vite is now 7.3.7, Vitest 4.1.12, and compatible transitive fixes were installed with non-forced `npm audit fix`. The final audit reported **zero vulnerabilities**. Full vendor verification (185 hashes and compiled copies), strict types, zero-warning lint, **71 unit/DOM tests**, production build, formatting, and **all 11 Chromium browser tests** passed.

Browser coverage includes the full quest, reload, native backup download/restore, invalid-import preservation, missing IndexedDB, keyboard focus, mobile navigation, responsive widths, and cross-tab draft preservation. Automated layout assertions are not human visual or accessibility certification. No new hosted deployment was performed. The separate private Sites preview remains unchanged.

The original local network/browser restrictions persist; GitHub Actions supplied the online validation environment. The local installed node_modules are older than the repaired lockfile; reinstall with `npm ci` in a network-enabled environment before relying on local runs. Historical blocked results below describe earlier attempts, not the current cloud result.

Remaining release work: independently review provisional exercises, perform visual review, repair and validate foundation main's dependencies before Pages deployment, configure/verify Pages, and complete broader dependency/current-release review. npm audit is a time-specific registry result, not proof that all dependencies or vendored source are vulnerability-free. Do not advance Slice 2 or merge the draft solely on automated tests.

## Historical record (before public dependency repair)

## 2026-10-28: Enforce the dependency release gate

Official advisories include the pinned Vite 7.2.2 and Vitest/@vitest/mocker 4.0.4 versions. Record package-range matches separately from attack prerequisites; the static application is not a hosted development server. Full sources and limitations are in DEPENDENCY_REVIEW.

Add `audit:dependencies` and require it in GitHub CI after install and before artifact publication. Choose a moderate-or-higher failure threshold including development dependencies; low findings still require review. Keep offline functional checks separately runnable. The registry audit failed with ENOTFOUND, so leave dependencies/lockfile unchanged rather than claiming an uninstalled upgrade. This change does not update the private Site or complete the security gate.

## 2026-10-28: Reconcile the separate private test deployment

The testing conversation created an owner-only Sites preview of v0.2.1. On continuation, Sites confirmed saved version 1 and a successful deployment at the recorded URL. Preserve that Site and its audience; do not create a duplicate or change access. Record both its separate source commit and the original application commit, without claiming byte equivalence or GitHub publication. See PREVIEW_ACCEPTANCE for exact IDs and observations.

Keep application version 0.2.1 for this documentation-only handoff. No new product slice or unverified behavior is introduced. The prepared acceptance checklist separates functional browser evidence from deployment status and preserves normal study records by using isolated test profiles. Public release still needs browser, dependency, content and GitHub gates. Rechecked GitHub lookup (404), invalid CLI credentials and npm ENOTFOUND; no usable browser-control tool is exposed in this session.

## 2026-10-28: Preserve exportability and tab-local drafts

Regression tests demonstrated that two valid backups could merge above the export byte limit, and that new answers or completion rewards could also push valid history above its byte/count limits. Validate the resulting serialized state inside the write transaction (or before merged writes), with a typed capacity error. This preserves earlier data and XP instead of acknowledging an action that leaves history unsupported by restore. Existing oversized 0.2.0 histories are not silently truncated; larger-history recovery remains outside this preview.

Tests also demonstrated that an external answer could replace a local unsaved form. Keep the active exercise and reviewed answer in component state for the current visit; subscribe to committed progress without replacing those local states. Continue storing the shared resume point for the next mount. Drafts remain intentionally unsaved until submission. Move keyboard focus after form replacement, with DOM regression checks and prepared browser assertions.

The user requested continuation, and the same publication/browser/npm blockers were reproduced. This continuation repairs Slice 1 without introducing Slice 2 or claiming independent content review.

## 2026-10-28: Continue a local Slice 1 feature branch

After the user requested continuation, rechecked GitHub, npm and browser access. The blockers persisted, but local implementation and database tests were possible. Preserve local main and implement Slice 1 on `feat/first-learning-quest`; retain partial status until review, browser and publication gates pass. This supersedes the earlier local instruction to wait for all Slice 0 gates before starting any Slice 1 work. No wider roadmap expansion is authorized by this exception.

## 2026-10-28: Source-built dependencies with verifiable provenance

Dexie and fake-indexeddb were absent from the offline cache. Retrieve official tagged GitHub sources at pinned commits, preserve licenses and all 185 upstream Git blob hashes, and build minimal ESM distributions with the cached esbuild 0.25.11. Dexie's documented version placeholder and constant-enum source require the adaptations recorded in `vendor/README.md`. The source is unchanged. `.gitattributes` disables line-ending normalization for vendor files to preserve exact hashes.

Use npm `file:` packages with `install-links=true` to avoid unavailable Windows symlink privileges. `npm run verify:vendor` reproduces compiled outputs and checks both tracked and installed copies. This is a transparent local exception, not an assertion that the artifacts are the npm-published distribution. Switch to registry packages, review dependencies and retest when network access returns. Reference: [npm install-links](https://docs.npmjs.com/cli/v11/using-npm/config/#install-links).

## 2026-10-28: Atomic activity history and backup merge

Keep attempts, sessions and rewards in Dexie schema 1. Commit an attempt and eligible reward together. Stable submission IDs handle retries; deterministic event IDs prevent farming. Completion has its own one-time event. Use full-state transactional snapshots and strict validation so import cannot introduce grades, XP, completions or content review labels inconsistent with known versioned records. Merge preserves existing history, rejects conflicting IDs and deduplicates rewards. No replace/delete restore mode is needed. Reference: [Dexie transactions](<https://dexie.org/docs/Dexie/Dexie.transaction()>).

The first-correct reward is 10 XP and completion is 20 XP, at most 80 for this content version. These are product activity rewards, not a psychometric claim. Notes are optional and saved only on submission. Explicitly open IndexedDB before reactive queries so missing storage yields a retryable error rather than indefinite loading.

## 2026-10-28: Provisional educational preview

Provide six original fictional exercises, provenance labels, conceptual references, explanations for each choice, and finite-model logic audits. Keep every item provisional and explicitly identify the absence of independent review. The learner chooses to start provisional practice. The author and automated checks cannot satisfy independent review; that remains a release gate, tracked in CONTENT_REVIEW.

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
