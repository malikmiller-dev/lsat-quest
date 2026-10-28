# Private preview acceptance

Status on 2026-10-28: deployment confirmed; the browser checks below have **not been executed by this agent**. A successful deployment is not a passing functional test. No user test results have been supplied.

Open [LSAT Quest v0.2.1](https://lsat-quest-v021-malik-test.yellowwren512.chatgpt.site/lsat-quest/). Access is restricted to the owner; use Continue with ChatGPT when prompted. Keep the site's current audience unchanged.

## Verified deployment evidence

| Field                           | Confirmed value                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| Site                            | `appgprj_6ae2335e1a6c8191acee79c72ca5eeb2`                                          |
| Saved version                   | 1                                                                                   |
| Version ID                      | `appgprj_6ae2335e1a6c8191acee79c72ca5eeb2~appgver_5783eba8a7a481919cf97863295a9991` |
| Deployment                      | `appgdep_6ae233bdc57c819192909a59874a893f`                                          |
| Status                          | `succeeded`                                                                         |
| Deployment timestamp            | 2026-10-28 13:42:28 America/New_York (17:42:28 UTC)                                 |
| Source commit reported by Sites | `ca5a6c70a5b0961b39baebcf6218f9f90f116926`                                          |
| Original application commit     | `df3affa442c8ace74fbe89cdc1226fdea2587ac7`                                          |
| Audience                        | Owner only; no external visitors or additional editors                              |

The original application and the hosted source have different Git histories. The testing conversation described this as a copy of v0.2.1. Source-byte equivalence has not been independently checked in this workspace. Do not substitute the hosted commit for the original application commit or report this as GitHub Pages publication.

## Test setup and evidence

Use a separate browser profile for synthetic test records. Sign in to the private preview there if required. Keep the normal study profile intact. For existing useful progress, first export a backup from Settings. Record browser/version, operating system, viewport, application version, date, steps, expected outcome, and observed outcome. Mark a check passed only after observing its complete result.

Current status for every check below: **pending**.

## Functional checks

| Check                  | Actions                                                                                                                                                                                                                           | Required result                                                                                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Direct navigation      | Open `/lsat-quest/#/settings` directly, refresh, then visit all six navigation views. Open `#/not-a-page` and use Back to overview.                                                                                               | Each route loads with its correct heading; the unknown route recovers. No broken script, stylesheet or image requests.                                                                |
| Theme persistence      | Select Light in Settings, refresh, close/reopen the tab in the same profile, then select Dark and refresh.                                                                                                                        | Each selection survives reload/reopen. Text, controls and focus indicators remain readable.                                                                                           |
| Lesson interaction     | In First quest, toggle Gold border and Number through all four combinations.                                                                                                                                                      | Only Gold border on / Number off violates the rule. Provisional status and conceptual references remain visible.                                                                      |
| Wrong answer and retry | Start provisional exercises. On exercise 1 choose B, enter `Synthetic test: reversed the rule`, and submit. Then choose Try again.                                                                                                | Incorrect feedback explains answer A; one wrong attempt is saved, with no XP. Focus moves to the feedback heading, then to the first answer on retry.                                 |
| Complete the quest     | Submit correct answers 1=A, 2=B, 3=C, 4=D, 5=A, 6=B, moving with Next exercise. Choose Complete quest and refresh.                                                                                                                | Six solved exercises, seven saved attempts including the earlier wrong answer, and exactly 80 XP. Completion survives refresh. Attempt history contains the synthetic note.           |
| Download and restore   | Export from Settings. In another fresh profile, sign in and choose that JSON file, then Merge backup. Import the same file a second time.                                                                                         | A real JSON download exists. Preview precedes mutation. Both imports finish with seven total attempts and 80 XP, with preserved notes and completion.                                 |
| Duplicate rewards      | In the restored profile, retry exercise 1 correctly. Revisit completion and refresh.                                                                                                                                              | Eight attempts, still 80 XP; completion is not rewarded again.                                                                                                                        |
| Rejected restore       | In the original test profile, choose a JSON file containing only `{"schemaVersion":99}`.                                                                                                                                          | A format/schema error appears; no Merge backup action is offered. Earlier seven attempts and 80 XP remain.                                                                            |
| Resume                 | Select exercise 3, refresh, close/reopen the tab and return to First quest.                                                                                                                                                       | Exercise 3 and its saved answer return. Unsubmitted choices/notes are not promised to survive navigation or reload.                                                                   |
| Cross-tab draft        | In a new empty test profile, start practice in tab A, choose B on exercise 1 and type a draft without submitting. Open tab B in the same profile, submit A on exercise 1, then B on exercise 2. Return to A and submit its draft. | A stays on exercise 1 with its selection/notes. Its progress updates to two solved / 20 XP. Its wrong submission remains in history alongside B's two answers: three attempts, 20 XP. |
| Dependency notices     | Open Settings and follow Dependency licenses.                                                                                                                                                                                     | The notices asset loads under the site's `/lsat-quest/` base path.                                                                                                                    |

Use the separate fresh-profile sequence for the cross-tab check so it is not affected by an already completed lesson. Do not mix those counts with the seven-attempt completion sequence.

## Interaction and layout checks

| Check                  | Required result                                                                                                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keyboard               | Tab reaches Skip to content; Enter focuses main. Links, exercise controls, radio answers, notes, feedback, backup controls and disclosures work without a mouse. Focus remains visible.                          |
| Mobile navigation      | At 390 px width, the menu opens; Escape closes it and returns focus to its trigger. Selecting a route closes the menu and focuses the new content.                                                               |
| Responsive views       | Inspect all six routes at 320, 390, 768, 1024 and 1440 px widths in both themes, including active practice, feedback, history and backup preview. No horizontal scrolling, clipped text or overlapping controls. |
| Zoom and accessibility | Inspect text and controls at 200% browser zoom. Check labels, errors, feedback announcements and focus order with a screen reader where available; record the actual tool and result.                            |
| Runtime failures       | Record console exceptions and failed requests throughout these checks. A clean-looking screenshot alone is insufficient evidence.                                                                                |

The existing [11-test Playwright suite](../e2e/browser_tests.py) covers automated local production-build regressions, including unavailable IndexedDB and denied preference storage. It still requires an environment that can launch Chromium and reach the preview server. It does not automate authentication to the private hosted site.

## Before the public release

Close the browser checks with actual evidence, review dependencies with registry access, and obtain independent educational review. Then follow [DEPLOYMENT](DEPLOYMENT.md) for the authorized GitHub repository, PR validation and Pages deployment. These remain separate release gates.

Study records belong to the browser profile and site address where they were created. Signing in to this preview does not add cloud sync. Before moving from this test address to GitHub Pages, export from the test site and explicitly restore at the new address. Neither deployment transfers study data automatically.
