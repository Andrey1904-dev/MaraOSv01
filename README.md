# Mara OS

A frontend-only Next.js recreation of the supplied Mara OS design archive. It uses the archive's dark visual system, shared application shell, linked Pexels image references, and mock data; no authentication, database, external data API, AI service, or payment integration is configured.

## Run locally

```bash
npm install
npm run dev
```

The dev server binds to `0.0.0.0`. Run the checks with:

```bash
npm run typecheck
npm run lint
npm run build
```

## Screens

- Command Center / Overview (`/`)
- Fans and fan profile (`/fans`, `/fans/[id]`)
- Conversations (`/conversations`)
- Content, editor, and new content (`/content`, `/content/[id]`, `/content/new`)
- Episodes (`/episodes`)
- Assets (`/assets`)
- Offers (`/offers`)
- Revenue (`/revenue`)
- Analytics (`/analytics`)
- AI Studio (`/ai`)
- Automations (`/automations`)
- Tasks (`/tasks`)
- Settings (`/settings`)

## Asset note

The source archive references its imagery from `images.pexels.com`; `src/data/media.ts` retains those original URLs rather than substituting new photos. Images are therefore not bundled locally and require network access to Pexels.

## Data boundary

Screens and shared UI consume typed repository methods through `src/repositories/index.ts`. The current implementation is `src/repositories/mock.ts`; the mock fixtures live separately under `src/data/`. Replacing the mock repositories with another implementation can preserve the same UI-facing interfaces in `src/types/index.ts`. Interactive changes are held in local React state and are intentionally not persisted.

## Validation notes

The production build, typecheck, lint, and HTTP smoke checks for every listed route passed in the current environment. There is no test script in `package.json`. Browser-level interaction and mobile overflow checks were not run because Chromium/Playwright are not installed in the environment; use the dev server to complete those checks in a browser. The project remains frontend-only by design.
