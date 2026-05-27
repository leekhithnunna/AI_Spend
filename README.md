# AI Spend Audit Tool

> Find hidden AI subscription waste in minutes.

A production-quality MVP that helps teams audit their AI tool subscriptions, identify overspending, and get actionable recommendations to optimize costs.

Built for the **Credex WebDev 2026 Internship Assignment**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4 |
| UI Components | shadcn-style primitives, Lucide React |
| Forms | React Hook Form + Zod (multi-step wizard) |
| State | Zustand + persist middleware (localStorage) |
| Backend | Supabase (PostgreSQL, optional) |
| Deployment | Vercel |

---

## Project Structure

```
root/
├── frontend/
│   ├── app/                 # App Router: /, /audit, /results
│   ├── components/
│   │   ├── audit/           # Form, results, step indicator
│   │   ├── landing/         # Hero, features, CTA, footer
│   │   ├── layout/          # Nav, page shell
│   │   └── ui/              # Button, Card, Input, etc.
│   ├── config/              # Pricing data + tool constants
│   ├── hooks/               # Store hydration helper
│   ├── lib/                 # Audit engine, Supabase, utils
│   ├── store/               # Zustand audit store
│   └── types/               # TypeScript interfaces
├── backend/
│   ├── supabase/
│   ├── sql/
│   └── docs/
├── README.md
├── DEVLOG.md
└── ARCHITECTURE.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### 1. Clone & Install

```bash
git clone https://github.com/leekhithnunna/AI_Spend.git
cd AI_Spend/frontend
npm install
```

### 2. Environment Setup

```bash
cp .env.local.example .env.local
# Optional: add Supabase credentials for audit persistence
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Run Tests

```bash
npm test
```

### Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page (hero, features, CTA) |
| `/audit` | Multi-step spend input form |
| `/results` | Audit results & recommendations |
| `/results/[auditId]` | Shareable saved audit report (Supabase required) |

---

## Supabase Setup (Optional)

```bash
# 1. Create a Supabase project at supabase.com
# 2. Run backend/sql/001_initial_schema.sql in SQL Editor
# 3. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
```

---

## Deploy to Vercel

Deploy from the `frontend/` directory (see `frontend/vercel.json`).

Set environment variables in the Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL` (optional)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)
- `NEXT_PUBLIC_APP_URL` (optional)

---

## Progress

### Day 1
- [x] Monorepo structure, Next.js + TypeScript + Tailwind
- [x] Landing page, spend form, audit engine, Zustand persistence
- [x] Supabase schema, documentation

### Day 2
- [x] Product Hunt–quality responsive landing page
- [x] Multi-step audit form (tools → plans → spend → team → review)
- [x] Dynamic plans per tool + validation + add/remove tools
- [x] Centralized pricing config with source URLs (`config/pricing.ts`)
- [x] Audit engine rules (downgrades, enterprise warnings, wrong-plan detection)
- [x] Dedicated results page with Credex CTA for high savings
- [x] App routing: `/`, `/audit`, `/results`
- [x] Loading/error states, localStorage reload persistence
- [x] `.env.local.example`, updated docs

---

## License

MIT
