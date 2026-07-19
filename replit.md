# Nex Monie

A fintech super-app for ambitious millennials — digital banking, P2P transfers, airtime/data/bills, and an Earn screen with live opportunities.

## Run & Operate

- `pnpm --filter @workspace/nex-monie run dev` — run the frontend (port 26147, preview at `/`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, prefix `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` (runtime-managed), `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` (auto-provisioned by Replit Clerk)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Tailwind v4 + Wouter + TanStack Query
- Auth: Replit-managed Clerk (`@clerk/react` on frontend, `@clerk/express` on backend)
- API: Express 5, contract-first (OpenAPI → Orval codegen)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (v4), `drizzle-zod`
- API codegen: Orval (from `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle for API server)

## Where things live

- `artifacts/nex-monie/src/pages/` — all app screens (Home, SendMoney, Earn, BuyAirtime, etc.)
- `artifacts/nex-monie/src/components/` — shared UI + dashboard widgets + layout
- `artifacts/api-server/src/routes/` — Express route handlers (wallet, transactions, airtime, data, bills, banks, transfers, users, scan, earn)
- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not edit)
- `lib/db/src/schema/` — Drizzle table definitions
- `attached_assets/nex-source/` — original Next.js source reference

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval → typed hooks for both frontend and backend validation
- Clerk auth proxied through `/api/__clerk` in production; dev instances connect directly to Clerk FAPI
- Mobile-first layout: `#root` capped at 430px with bottom-nav navigation pattern
- Earn screen uses SSE (`/api/earn/stream`) to stream live opportunities from Superteam Earn and other sources
- All mock data is intentional for current dev stage; P2P and wallet will connect to real DB/Paystack

## Git remotes

- `origin` → `github.com/John474747/Nexus-prime` (development)
- `production` → `github.com/John474747/nex-monie-production` (stable only)

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after every OpenAPI spec change before touching frontend hooks
- `tailwindcss({ optimize: false })` in vite.config.ts is required — without it, `@clerk/themes/*.css` gets reordered in prod and Clerk UI breaks
- Clerk keys: `pk_test_*` in dev is expected and not an error
- Never call `setAuthTokenGetter` in the web app — Clerk uses session cookies; that pattern is Expo-only

## User preferences

- Minimum credits usage — be concise
- Push to `origin` (Nexus-prime) regularly; push to `production` only when stable
- Do not redesign, refactor, or change architecture — extend and fix only
- Test each feature before proceeding to next
