# Publication continuation

## Existing private test preview

[LSAT Quest v0.2.1](https://lsat-quest-v021-malik-test.yellowwren512.chatgpt.site/lsat-quest/) is deployed as an owner-only Sites test copy. Saved version 1 and its successful deployment were confirmed on 2026-10-28; [PREVIEW_ACCEPTANCE](PREVIEW_ACCEPTANCE.md) records the exact source/version/deployment IDs and functional checks still pending. Reuse that Site and preserve its audience if future preview changes are requested. The original repo has no Sites hosting manifest; do not infer that its local branch is already synchronized with the separate hosted source.

GitHub publication and Pages remain the user's required public target. Preserve the preview during that work. Learner records do not transfer between addresses: export from the test site and restore at the Pages site when migrating.

## Verified access state

The connected GitHub profile identifies `malikmiller-dev` (user ID 13230444). Listing that account's accessible repositories returned no `lsat-quest`. Local `gh auth status` failed: the active `blankcnvs` credential is invalid. Do not push under the old account blindly. The connector can read/write existing repository content but exposes no repository-create or Pages-settings mutation. Browser helpers failed before a usable browser session was available.

## Steps once GitHub authentication and network are available

1. Run `gh auth status` and `gh api user --jq .login`; confirm the expected authorized account.
2. Inspect `gh repo view malikmiller-dev/lsat-quest` before creation. If it exists, fetch and inspect its source/history; reconcile without overwriting or force pushing.
3. Restore registry network access, review current stable dependency versions/security advisories, update the lockfile, and rerun all checks. The cached dependency set is a local milestone, not the current-stable gate.
4. If the repository is still absent, create it with the authorized public visibility and description:

```sh
gh repo create malikmiller-dev/lsat-quest --public --source=. --remote=origin --description "An open, gamified, AI-assisted LSAT preparation platform featuring adaptive learning, spaced repetition, personalized tutoring, and LawHub-based assessment."
```

5. In repository Settings → Pages, choose **GitHub Actions** as the source. This can also be configured through the authenticated GitHub Pages REST endpoint where account permissions permit.
6. Push `main`. Inspect the `Deploy GitHub Pages` workflow and its validation job. Do not bypass a failure.
7. After workflow success, open the returned Pages URL; test direct `#/settings` refresh, assets, both themes, mobile navigation, and stored appearance.
8. Record actual repository URL, commit SHA, run URL, deployment URL, and verification results in PROGRESS. A predicted URL is not verification.

Later work uses focused feature branches and PR validation before merging to main. Do not rewrite history or push personal/private data.

Slice 1 is now on local `feat/first-learning-quest`. After main publication and access recovery, push that branch, open a focused PR, run its full validation, and merge only after browser/content/dependency review. The current source-build exception and content status are documented in `vendor/README.md` and CONTENT_REVIEW. Verify native study backup downloads, restoration into a fresh browser context, persisted exercise history, and the deployed dependency-notices asset in addition to the foundation checks.

## Workflow design

The validation job now requires `npm run audit:dependencies` immediately after install. It includes development dependencies and fails on moderate-or-higher reports or an unavailable audit request. The job cannot upload its Pages artifact after that failure. See [DEPENDENCY_REVIEW](DEPENDENCY_REVIEW.md) for unresolved findings. Actual execution on GitHub remains unverified.

`ci.yml` runs on PRs and non-main pushes, and is callable by `deploy.yml`. It installs locked dependencies, checks types/lint/tests/build, runs Playwright against the build, and uploads the exact verified `dist/` only for main. `deploy.yml` requires that job before deployment. Non-main manual deploy requests are excluded. Production permissions are isolated to the deploy job.

Sources consulted: [Vite deployment](https://vite.dev/guide/static-deploy.html#github-pages), [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [reusable workflows](https://docs.github.com/en/actions/sharing-automations/reusing-workflows), [Playwright CI](https://playwright.dev/python/docs/ci).
