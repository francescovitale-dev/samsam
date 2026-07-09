# SamSam Offertes

Internal web app for creating, managing and exporting branded **energy-storage sales
proposals** (offertes) for SamSam. Replaces the manual Word/PDF workflow: enter data once
in the catalog, reuse it across every proposal, and export a pixel-clean 12-page branded PDF.

Built for a single internal user — a shared password protects the app, no accounts or email.

---

## What it does

- **Dashboard** — all offertes with status (Concept / Geaccepteerd / Afgewezen), search & filter.
- **Catalogus** — batteries, werkzaamheden, EMS, options and chargers. Cost price + margin →
  live sell price. This is the single source of truth for all pricing.
- **Klanten** — customers, reused across proposals.
- **Offerte builder** — pick a customer, template (**batterij** or **batterij + lader**) and
  design; edit everything with a live 12-page preview beside the form. Auto-calculates
  per-column totals, 21% BTW and price-per-kWh.
- **Interne marge** — private per-proposal cost / sell / gross-margin view (never in the PDF).
- **Branded PDF** — real headless-Chromium render of the exact on-screen design.
- **Instellingen** — company details, brand colours, default margin, BTW, and the letter copy.

Proposals **snapshot** the catalog when created, so changing a catalog price later only affects
**new** offertes; existing ones never change.

---

## Tech stack

- **Next.js 16** (App Router, Turbopack) · **TypeScript** · **React 19**
- **Tailwind v4** · **shadcn/ui** (Base UI) · Dutch UI
- **PostgreSQL** · **Prisma 7** (pg driver adapter)
- **PDF**: `puppeteer-core` + `@sparticuz/chromium` (Vercel) / local Chrome (dev) / Browserless (optional)
- **File storage**: Vercel Blob (prod) / local `/public/uploads` (dev)
- **Auth**: single shared-password cookie gate
- **Tests**: Vitest (calculation unit tests) · Playwright (e2e happy paths)

Money is stored as **integer euro-cents** everywhere; formatted `nl-NL` only for display.
All proposal math flows through one pure `computeTotals()` function (`src/lib/proposal/compute.ts`),
unit-tested against the reference figure (Huawei column **€ 77.155** at 15% margin).

---

## Local development

Prerequisites: Node 20.9+, a local PostgreSQL, and Google Chrome (for PDF export in dev).

```bash
# 1. install
npm install

# 2. create a database (example uses local Homebrew Postgres)
createdb samsam_offerte

# 3. configure env
cp .env.example .env
#   - set DATABASE_URL
#   - set APP_PASSWORD (login password) and APP_GATE_TOKEN (random: openssl rand -hex 24)
#   - set CHROME_EXECUTABLE_PATH to your Chrome binary for PDF export in dev
#     (macOS: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")

# 4. migrate + seed (creates catalog, an example customer + proposal, settings)
npm run db:migrate
npm run db:seed

# 5. run
npm run dev            # http://localhost:3000  (log in with APP_PASSWORD)
```

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `start` | Production build / serve |
| `npm test` | Vitest unit tests (calculations) |
| `npx playwright test` | e2e tests (needs the dev server running) |
| `npm run db:migrate` | Apply Prisma migrations (dev) |
| `npm run db:seed` | Seed catalog, settings, example proposal |
| `npm run db:studio` | Prisma Studio |
| `npm run db:reset` | Reset DB + re-seed |

---

## Environment variables

| Var | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `APP_PASSWORD` | ✅ | The login password |
| `APP_GATE_TOKEN` | ✅ | Random secret cookie value (`openssl rand -hex 24`) |
| `BLOB_READ_WRITE_TOKEN` | prod | Vercel Blob — **required in production** for photo uploads (see below) |
| `CHROME_EXECUTABLE_PATH` | dev | Local Chrome path for PDF export in development |
| `BROWSERLESS_URL` | optional | Managed-browser WS endpoint if the serverless Chromium bundle is too big |
| `NEXT_PUBLIC_APP_URL` | optional | Public base URL |
| `MONEYBIRD_*`, `FEATURE_MONEYBIRD` | optional | Phase-2 invoicing (scaffold only, off by default) |

---

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Provision **Vercel Postgres** or **Neon**; set `DATABASE_URL`.
3. Create a **Vercel Blob** store; set `BLOB_READ_WRITE_TOKEN`.
   ⚠️ Vercel's filesystem is read-only, so the local `/public/uploads` fallback does **not**
   work in production — a Blob token is required for battery photo uploads there.
4. Set `APP_PASSWORD` and `APP_GATE_TOKEN` in the project's environment variables.
5. Apply migrations against the production DB and seed once:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
6. Deploy. The PDF route runs on the Node.js runtime and uses `@sparticuz/chromium`
   automatically (no `CHROME_EXECUTABLE_PATH` in prod). If the serverless bundle exceeds
   limits, set `BROWSERLESS_URL` to fall back to a managed browser.

`@prisma/client`, `@prisma/adapter-pg`, `puppeteer-core` and `@sparticuz/chromium` are declared
as `serverExternalPackages` so they aren't bundled.

---

## How the founder uses it

1. Add/adjust batteries and stelposten in **Catalogus** (cost + margin → sell price).
2. Add the customer once in **Klanten**.
3. **Nieuwe offerte** → pick customer + template → tweak prices/specs with live preview.
4. Check **Interne marge** to confirm the profit.
5. **PDF** to download the branded offerte, and send it however you like.
6. Mark the offerte **Geaccepteerd** / **Afgewezen** to track your pipeline.

---

## Project layout

```
prisma/                     schema, migrations, seed
src/lib/
  proposal/                 types, computeTotals, snapshot builder, spec fields
  money.ts                  cents <-> nl-NL formatting
  content/                  ported FIX copy + seed catalog data
  gate.ts, prisma.ts        password gate, db client
  pdf.ts                    headless-Chromium launcher + render
src/components/proposal/    <ProposalDocument> (12-page renderer) + scoped CSS
src/app/(app)/              gated app: dashboard, catalogus, klanten, offerte, instellingen
src/app/print/[id]/         token-gated bare document (PDF source)
tests/e2e/                  Playwright happy paths
```

The proposal renderer is a single component used for **both** the on-screen preview and the PDF,
so they can never diverge. Both templates and every design theme consume the same
`ProposalData` shape.
