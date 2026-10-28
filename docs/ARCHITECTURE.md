# Architecture

## Foundation

React with strict TypeScript, Vite production bundling, Tailwind theme/utility styles plus semantic CSS, and browser-native hash routing. Local component state is sufficient for four views. All built files are static. No server, authentication, database service, or API is required.

## Implemented boundaries

- `app/App.tsx`: shell and foundation pages; split by feature when the first real learning flow is added.
- `components/Icon.tsx`: original inline SVG icon component.
- `domain/navigation.ts`: route parsing and names; unknown routes render a recoverable not-found screen.
- `domain/roadmap.ts`: product feature roadmap, not learner progress.
- `services/appearance.ts`: versioned preference read/write with explicit blocked-storage recovery.
- `styles.css`: shared tokens, dark/light palettes, responsive layout, keyboard focus and reduced-motion behavior.
- `e2e/browser_tests.py`: Playwright tests against the production build.

## Persistence contract

`localStorage['lsat-quest:appearance:v1']` is either `dark` or `light`. Missing or invalid data yields dark. Read/write exceptions do not break the app and surface a visible notice. No study data exists in Slice 0. Clearing browser storage removes this preference.

## Hosting

Vite base is `/lsat-quest/`. Routes use fragments (`#/settings`) so refresh requests the same static index. CI is reusable by the deploy workflow. Only a validated main-branch artifact can reach the deploy job. Production runtime has no dependencies on Node/Python; those are build/test tools.

## Planned boundaries, introduced only when needed

Curriculum/content provenance, question versions/attempts, tutoring, memory scheduling, evidence-based mastery, rewards, official-assessment adapter, and backup/settings. Slice 1 introduces IndexedDB/Dexie with schema versioning and transaction-safe attempt/reward writes. AI is deferred to Slice 8; do not configure credentials or call providers during foundation work.
