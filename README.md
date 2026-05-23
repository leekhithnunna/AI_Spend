# AI Spend Audit Tool

> Find hidden AI subscription waste in minutes.

A production-quality MVP that helps teams audit their AI tool subscriptions, identify overspending, and get actionable recommendations to optimize costs.

Built for the **Credex WebDev 2026 Internship Assignment**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| UI Components | shadcn/ui, Lucide React |
| Forms | React Hook Form + Zod |
| State | Zustand + persist middleware |
| Backend | Supabase (PostgreSQL) |
| Deployment | Vercel |

---

## Project Structure

```
root/
├── frontend/          # Next.js 15 app
│   ├── app/           # App Router pages & layouts
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utilities, audit engine, Supabase client
│   ├── store/         # Zustand state management
│   ├── types/         # TypeScript interfaces
│   ├── styles/        # Global styles
│   └── public/        # Static assets
├── backend/
│   ├── supabase/      # Supabase config & migrations
│   ├── sql/           # SQL schema files
│   └── docs/          # Backend documentation
├── README.md
├── DEVLOG.md
└── ARCHITECTURE.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account (free tier works)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd frontend
npm install
```

### 2. Environment Setup

```bash
cp .env.local.example .env.local
# Fill in your Supabase credentials
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Supabase Setup

```bash
# 1. Create a new Supabase project at supabase.com
# 2. Run the migration file
# Go to Supabase Dashboard → SQL Editor
# Paste contents of backend/sql/001_initial_schema.sql
# Click Run
```

---

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Day 1 Checklist

- [x] Monorepo structure created
- [x] Next.js 15 + TypeScript initialized
- [x] Tailwind CSS + shadcn/ui configured
- [x] Landing page with hero, features, form, footer
- [x] Spend input form with validation
- [x] Zustand persist middleware (survives refresh)
- [x] Deterministic audit engine
- [x] Results display with savings breakdown
- [x] Supabase schema + migration file
- [x] Environment variables setup
- [x] Documentation files created

---

## License

MIT
