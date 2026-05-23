# Dev Log — AI Spend Audit Tool

A running log of development progress, decisions, and learnings.

---

## Day 1 — May 23, 2026

### Goals
- [x] Initialize monorepo structure
- [x] Setup Next.js 15 frontend
- [x] Build spend input form
- [x] Implement audit engine
- [x] Connect Supabase schema
- [x] Add local persistence

### What I Built

**Project Scaffold**
Set up a clean monorepo with `frontend/` and `backend/` separation. Frontend uses Next.js 15 App Router with TypeScript strict mode. Backend holds Supabase SQL migrations and docs.

**Landing Page**
Dark SaaS-style landing page with hero, features section, audit form, and footer. Focused on communicating the value prop: "Find hidden AI subscription waste in minutes."

**Spend Input Form**
Dynamic multi-tool form using React Hook Form + Zod. Supports 8 AI tools (Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf). Users can add multiple tools and the form validates all fields.

**Audit Engine**
Deterministic rule-based engine in `frontend/lib/audit-engine.ts`. No AI calls — pure business logic. Rules cover:
- Seat-based plan downgrades (e.g., ChatGPT Team → Plus for ≤2 seats)
- Enterprise plan warnings for small teams
- API spend thresholds
- Credex consultation triggers for high spenders

**State Persistence**
Zustand store with `persist` middleware saves form state to localStorage. Survives page refresh and accidental reloads.

**Supabase Schema**
Two tables: `audits` (stores audit results as JSONB) and `leads` (captures email/company for follow-up). Migration file ready to run.

### Decisions Made

- **No AI API calls in audit engine** — keeps it fast, free, and deterministic. Rules are transparent and explainable.
- **JSONB for audit_data** — flexible schema for evolving audit output without migrations.
- **Zustand over Redux** — simpler API, built-in persist middleware, less boilerplate.
- **shadcn/ui over custom components** — production-quality accessible components, faster to build.

### Blockers / Notes

- Supabase credentials needed before save-to-DB feature works (graceful fallback in place)
- shadcn/ui requires manual component installation via CLI after `npm install`

### Time Spent
~6 hours

---

## Day 2 — (Upcoming)

### Planned
- [ ] Wire up Supabase save on form submit
- [ ] Lead capture modal after audit
- [ ] Email notification via Supabase Edge Functions
- [ ] Analytics dashboard (audit history)
- [ ] Export audit results as PDF

---
