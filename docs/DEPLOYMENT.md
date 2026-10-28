# Publication continuation

## Current state

Public source: https://github.com/malikmiller-dev/lsat-quest. Draft Slice 1 PR: https://github.com/malikmiller-dev/lsat-quest/pull/1. Original Git history is preserved without force pushes; origin and tracking branches are configured. Main remains the foundation, while the feature branch includes the learning activity.

The connected GitHub app can publish repository changes. GitHub Actions provides working npm and Chromium access. Local shell network restrictions and the old invalid CLI credential remain; they do not block connected-app operations. Do not recreate the repository or blindly replace its history.

The feature dependency repair and full tests passed; see VALIDATION. Main's first deployment run stopped at its dependency audit, so its deploy job was skipped. Pages is not configured or verified. Repair main's own dependency set and run the foundation checks before deployment. Do not merge provisional Slice 1 merely to obtain its dependency fixes.

## Remaining deployment steps

1. Repair and validate foundation dependencies in a focused branch/PR, preserving foundation behavior.
2. Set repository Settings > Pages > Source to GitHub Actions using the authenticated owner session.
3. Run the main deployment workflow only with a passing audit and functional/browser validation.
4. Inspect the returned deployment URL, direct hash-route refresh, production assets, themes, mobile navigation, and appearance persistence. Record the actual run and URL; a predicted URL is not verification.
5. For Slice 1, complete independent content and visual review and final PR checks before merge; then verify native backups, restore, and persistence on the deployed origin.

## Existing private preview

The owner-only [Sites test preview](https://lsat-quest-v021-malik-test.yellowwren512.chatgpt.site/lsat-quest/) remains unchanged. PREVIEW_ACCEPTANCE records its separate source/version/deployment IDs. Cloud tests on the repaired GitHub source do not establish byte equivalence or hosted behavior for that older preview. Preserve its audience. Learner records do not transfer between origins; export and restore when migrating.

## Workflow design

`ci.yml` runs on PRs and non-main pushes, and is callable by `deploy.yml`. It installs locked dependencies, audits runtime/development packages, verifies vendor builds, types, lint, tests, formatting and production build, then runs Chromium tests. Only validated main builds upload Pages artifacts. Deployment requires validation and isolates deployment permissions. The temporary dependency repair workflow was removed after its successful run; its evidence remains in Actions and Git history.
