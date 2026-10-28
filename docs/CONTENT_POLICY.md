# Content and licensing policy

## Current release

The local preview contains original interface copy, SVG/CSS shapes, a lesson, and six original versioned exercises with answer keys and explanations. It contains no official LSAT questions, copied third-party study content, real learner records, or generated tutoring. All educational content is AI-authored and provisional, with no independent reviewer. See [CONTENT_REVIEW](CONTENT_REVIEW.md) for provenance, conceptual sources, internal checks, and remaining review work. Public visibility does not imply affiliation or redistribution rights.

## Project license decision

No blanket open-source or educational-content license is granted yet. `package.json` is `UNLICENSED`. This is a conservative temporary decision until the owner selects a license. Third-party packages retain their own licenses; npm dependency metadata and package license files must be preserved when distributed. An open product vision is not itself permission to redistribute third-party material.

## Versioned content and future extension

Each question/passage must include ID, version, competency, source type, provenance, authorship method, license/rights, review status, answer and explanation history. Statuses should distinguish provisional, reviewed, rejected, and official-reference-only. Rejected content cannot enter practice. Provisional content requires an explicit learner-facing label and cannot silently enter trusted practice. Structural/model consistency is not independent expert review.

The first six question records retain immutable IDs/versions, answer keys, and choice explanations. They share the lesson competency and provenance metadata in `domain/learning.ts` and the itemized review ledger. Attempts pin a question version and provisional status. Any future content revision must preserve the previous version needed to reproduce history.

## Official material and data

Do not scrape LawHub, bypass access controls, or copy protected questions into this repository. Begin with a launcher and manual score entry. Confirm exam formats from current official LSAC sources at implementation time and version each record. Keep private learner data and backups local and ignored by Git. Do not send protected content to external models without appropriate permission.
