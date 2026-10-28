# Roadmap

| Slice | Deliverable                                                                       | Status                                               |
| ----- | --------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 0     | Repository, application shell, CI/CD, public site                                 | Public source; foundation Pages gate pending         |
| 1     | Necessary/sufficient conditions: lesson, original questions, attempts, XP, backup | Public draft PR; 71 unit/DOM + 11 browser tests pass |
| 2     | Competencies and structured curriculum                                            | Planned                                              |
| 3     | Versioned question engine and mistake journal                                     | Planned                                              |
| 4     | Memory, spaced repetition and retention                                           | Planned                                              |
| 5     | Deterministic adaptive study planner                                              | Planned                                              |
| 6     | RPG progression and educational rewards                                           | Planned                                              |
| 7     | LawHub launcher and manual official assessments                                   | Planned                                              |
| 8     | Optional provider-neutral AI tutoring                                             | Planned                                              |
| 9     | Reading Comprehension activities                                                  | Planned                                              |
| 10    | One complete reasoning mini-game, then expansion                                  | Planned                                              |
| 11    | Provisional generation and content approval                                       | Planned                                              |
| 12    | Reproducible learning analytics                                                   | Planned                                              |
| 13    | Argumentative Writing                                                             | Planned                                              |
| 14    | Accessibility, performance, offline hardening                                     | Planned                                              |
| 15    | Comprehensive integration and product evaluation                                  | Planned                                              |

Accessibility basics are required from Slice 0; Slice 14 is additional hardening. No roadmap dates imply official exam-format claims. Check current LSAC sources when implementing exam-versioned assessment.

## Next slice acceptance

The repaired feature branch passes the required dependency audit and all automated tests in GitHub Actions. Independent educational review, visual inspection, and public deployment remain open. Foundation main needs its separate dependency repair. See PROGRESS and VALIDATION.

Slice 1 must persist correct and incorrect attempts, prevent duplicate XP, restore backups atomically after validation, retain the exact question version, and label content provenance/review status honestly. Automated tests must cover reload, interrupted flow, duplicate submission, and invalid import. Do not call AI-generated questions independently verified without actual independent review.
