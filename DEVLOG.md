# Dev Log — AI Spend Audit Tool

A running log of development progress, decisions, and learnings.

---

## Day 1 — May 23, 2026

### Goals
- [x] Initialize monorepo structure
- [x] Setup Next.js frontend
- [x] Build spend input form
- [x] Implement audit engine
- [x] Connect Supabase schema
- [x] Add local persistence

### What I Built

**Project Scaffold**
Set up a clean monorepo with `frontend/` and `backend/` separation. Frontend uses Next.js App Router with TypeScript strict mode. Backend holds Supabase SQL migrations and docs.

**Landing Page**
Dark SaaS-style landing page with hero, features section, audit form, and footer. Focused on communicating the value prop: "Find hidden AI subscription waste in minutes."

**Spend Input Form**
Dynamic multi-tool form using React Hook Form + Zod. Supports 8 AI tools. Users can add multiple tools and the form validates all fields.

**Audit Engine**
Deterministic rule-based engine in `frontend/lib/audit-engine.ts`. Rules cover seat downgrades, enterprise warnings, API spend thresholds, and Credex consultation triggers.

**State Persistence**
Zustand store with `persist` middleware saves form state to localStorage.

**Supabase Schema**
`audits` and `leads` tables with migration file ready to run.

### Decisions Made

- No AI API calls in audit engine — fast, free, deterministic
- JSONB for audit_data — flexible schema
- Zustand over Redux — simpler persist story
- shadcn/ui-style components — accessible, customizable

### Time Spent
~6 hours

---

## Day 2 — May 25, 2026

### Goals
- [x] Responsive Product Hunt–quality landing page
- [x] Multi-step spend input form with dynamic plans
- [x] Centralized pricing configuration
- [x] Audit engine enhancements + results page
- [x] Routing (`/`, `/audit`, `/results`)
- [x] Documentation + deploy-ready build

### What I Built

**Landing Page Refresh**
Split landing from audit flow. Added hero mock preview, gradient grid background, dual CTAs, and dedicated CTA section. Navigation links to all routes.

**Multi-Step Audit Form**
Five-step wizard: Tools → Plans → Spend → Team → Review. Per-step validation with React Hook Form. Add/remove tools at any step. Form syncs to Zustand on change.

**Pricing Configuration**
Created `frontend/config/pricing.ts` with per-tool plans, per-seat prices, and official pricing source URLs. `config/tools.ts` holds supported tools and savings thresholds. Audit engine imports pricing via `getPlanPriceMap()`.

**Audit Engine Updates**
Added wrong-plan selection rule (paying above list price), Windsurf Team → Pro downgrade, and imports from centralized config.

**Results Page**
`/results` route with hydration loading state, redirect to `/audit` when empty, per-tool breakdown, Credex CTA when annual savings ≥ $1,000 or monthly ≥ $150.

**Routing & Layout**
Shared `Nav` + `PageShell` components. Environment example at `frontend/.env.local.example`.

### Decisions Made

- **Separate routes over single-page scroll** — clearer UX, shareable results URL, matches assignment spec
- **Pricing in config/** — single source of truth for form suggestions and audit math
- **Credex CTA gated by savings thresholds** — only shown when recommendations are high-impact

### Blockers / Notes

- Supabase save remains optional (graceful fallback)
- Vercel deploy uses `frontend/` as project root

### Time Spent
~5 hours

---

## Day 3 — (Upcoming)

### Planned
- [ ] Wire up Supabase save on form submit with error UI
- [ ] Lead capture modal after audit
- [ ] Export audit results as PDF
