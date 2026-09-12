---
name: capstn-stack
description: Project structure and conventions for the capstone app — a MERN + Vite stack written entirely in TypeScript, split into two separate repos (server backend deployed on Render, client frontend deployed on Vercel). Use this skill whenever creating, organizing, reviewing, or discussing files in either server or client — e.g. adding a new API resource/route/controller, adding a new frontend feature/component/hook, setting up env vars, build/deploy scripts, or deciding where a new file should live. Also trigger when the user mentions "the backend", "the frontend", "server", "client", or asks about the capstone project's folder structure.
---

# CapStn Project Structure

## Stack

- **M**ongoDB + **E**xpress + **R**eact + **N**ode (MERN), with **Vite** as the frontend build tool.
- **TypeScript everywhere** — backend and frontend both. No `.js` files in either repo.
- **Two separate repos/projects**, not a monorepo:
  - `server` → Express API → deployed on **Render**
  - `client` → React + Vite app → deployed on **Vercel**

Keep them separate. Each has its own `package.json`, `node_modules`, `.env`, and `tsconfig.json`. Don't introduce a monorepo tool (Turborepo/Nx) or try to share a single `node_modules` — the project is intentionally split so each side can be deployed and versioned independently. Shared types between the two are duplicated manually in each repo's `types/` folder rather than published as a shared package.

## Backend — `server`

```
server/
├── src/
│   ├── api/
│   │   ├── AiAnalysis/
│   │   │   ├── analyse.controller.ts
│   │   │   ├── analyse.routes.ts
│   │   │   ├── analyse.service.ts      # business logic — keep controllers thin
│   │   │   └── analyse.validation.ts   # zod/joi request schema
│   │   ├── User/
│   │   ├── Question/
│   │   ├── Response/
│   │   └── Survey/
│   │       # same file pattern in each resource folder:
│   │       # <name>.controller.ts, <name>.routes.ts, <name>.service.ts, <name>.validation.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── models/          # Mongoose schemas
│   ├── types/           # shared interfaces, Express Request augmentation
│   ├── config/          # db.ts, env.ts (validate process.env once, export typed config)
│   └── app.ts           # express app + middleware wiring — NO app.listen() here
├── server.ts            # imports app, calls app.listen() — Render's entry point
├── seedAll.ts
├── .env
├── tsconfig.json
└── package.json
```

Conventions:
- Each API resource under `src/api/` is self-contained: controller (req/res handling), routes (Express router), service (business logic / DB calls), validation (request schema). Controllers stay thin and delegate to services.
- `app.ts` vs `server.ts` are split on purpose: `app.ts` exports the configured Express app (useful for testing); `server.ts` is the only place that binds a port.
- Use `process.env.PORT` (Render assigns this at runtime) — never hardcode a port.
- `cors()` must allow the deployed Vercel frontend origin (and localhost during dev).
- `package.json` needs:
  - `"build": "tsc"` → outputs to `dist/`
  - `"start": "node dist/server.js"`
  - Render runs `build` then `start`.

## Frontend — `client`

```
client/
├── src/
│   ├── api/           # axios instance + one file per resource (analyse.api.ts, user.api.ts, ...)
│   ├── app/            # routes/pages
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── hooks/
│   ├── types/
│   └── utils/
├── vercel.json          # only needed for custom rewrites/redirects (e.g. SPA fallback)
├── .env                 # e.g. VITE_API_BASE_URL=...
├── vite.config.ts
├── tsconfig.json
└── package.json
```

Conventions:
- Mirror the backend's per-resource pattern in `src/api/`: one file per resource, wrapping a shared axios instance.
- Vercel auto-detects Vite (`npm run build` → `dist/`); no config needed unless adding SPA rewrites.
- Any env var read in the browser **must** be prefixed `VITE_` (e.g. `VITE_API_BASE_URL`), or Vite won't expose it to client code.
- Set `VITE_API_BASE_URL` per environment (Preview vs Production) in the Vercel dashboard, pointed at the Render API URL.
- Double-check there's no accidental collision between an `app/` folder and an `app.json` file (can happen from leftover Expo config) — this can confuse the Vite build.

## Where does a new file go?

- **New backend resource** (e.g. "Comment"): create `src/api/Comment/` with `comment.controller.ts`, `comment.routes.ts`, `comment.service.ts`, `comment.validation.ts`; add its Mongoose schema to `src/models/`; register the route in wherever routes are aggregated (likely `app.ts` or a router index).
- **New frontend feature**: page/route goes in `src/app/`, reusable UI in `src/components/`, data fetching in `src/api/<resource>.api.ts`, shared state in `src/context/` or `src/hooks/`.
- **Shared type between FE/BE** (e.g. `AiAnalysis` shape): define once in `server/src/types/`, then copy/mirror it into `client/src/types/` — keep them named identically to make drift easy to spot.
