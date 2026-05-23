# Architecture — AI Spend Audit Tool

## System Overview

The AI Spend Audit Tool is a client-heavy web application. The audit logic runs entirely on the frontend (no server round-trips needed for core functionality), with Supabase used for optional persistence and lead capture.

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────┐  │
│  │  Landing     │    │  Audit Form  │    │ Results  │  │
│  │  Page        │───▶│  (RHF+Zod)   │───▶│ Display  │  │
│  └──────────────┘    └──────┬───────┘    └────┬─────┘  │
│                             │                 │         │
│                    ┌────────▼─────────┐       │         │
│                    │  Zustand Store   │       │         │
│                    │  (localStorage)  │       │         │
│                    └────────┬─────────┘       │         │
│                             │                 │         │
│                    ┌────────▼─────────┐       │         │
│                    │  Audit Engine    │───────┘         │
│                    │  (deterministic) │                 │
│                    └──────────────────┘                 │
└─────────────────────────────────────────────────────────┘
                              │
                    (optional persistence)
                              │
                    ┌─────────▼──────────┐
                    │     Supabase       │
                    │  ┌──────────────┐  │
                    │  │   audits     │  │
                    │  │   leads      │  │
                    │  └──────────────┘  │
                    └────────────────────┘
```

---

## Frontend Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── page.tsx            # Landing page (hero + form + results)
│   └── globals.css         # Tailwind base styles
├── components/
│   ├── ui/                 # shadcn/ui primitives (Button, Card, etc.)
│   ├── landing/
│   │   ├── Hero.tsx        # Hero section
│   │   ├── Features.tsx    # Features grid
│   │   └── Footer.tsx      # Footer
│   └── audit/
│       ├── AuditForm.tsx   # Main multi-tool form
│       ├── ToolEntry.tsx   # Single tool row
│       └── AuditResults.tsx # Results display
├── lib/
│   ├── audit-engine.ts     # Core audit logic (deterministic rules)
│   ├── supabase.ts         # Supabase client singleton
│   └── utils.ts            # cn() helper + misc utils
├── store/
│   └── audit-store.ts      # Zustand store with persist
├── types/
│   └── audit.ts            # TypeScript interfaces
└── styles/
    └── globals.css         # (symlinked to app/globals.css)
```

---

## Backend Structure

```
backend/
├── supabase/
│   └── config.md           # Supabase project setup guide
├── sql/
│   └── 001_initial_schema.sql  # Database migration
└── docs/
    └── api.md              # API documentation
```

---

## Data Flow

### Audit Flow (Happy Path)

```
1. User fills out AuditForm
   └── React Hook Form manages field state
   └── Zod validates on submit

2. Form data saved to Zustand store
   └── Persisted to localStorage automatically
   └── Survives page refresh

3. Audit Engine processes input
   └── Applies deterministic business rules
   └── Returns typed AuditResult

4. Results displayed in AuditResults component
   └── Shows savings, recommendations, per-tool breakdown

5. (Optional) Save to Supabase
   └── POST audit_data as JSONB to audits table
   └── Capture lead info in leads table
```

### Audit Engine Rules

| Rule | Condition | Recommendation |
|------|-----------|----------------|
| R1 | ChatGPT Team, ≤2 seats | Downgrade to ChatGPT Plus |
| R2 | Claude Team, ≤3 seats | Downgrade to Claude Pro |
| R3 | API spend > $500/mo | Contact Credex for optimization |
| R4 | Team size < 5, enterprise plan | Downgrade to individual plan |
| R5 | Multiple overlapping tools | Consolidate to fewer tools |
| R6 | Low utilization (seats >> team size) | Reduce seat count |

---

## Database Schema

### `audits` table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| audit_data | jsonb | Full audit input + results |
| monthly_savings | numeric | Calculated monthly savings |
| annual_savings | numeric | Calculated annual savings |
| created_at | timestamptz | Timestamp |

### `leads` table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | text | Lead email |
| company | text | Company name |
| role | text | Job role |
| team_size | integer | Team size |
| audit_id | uuid | FK → audits.id |
| created_at | timestamptz | Timestamp |

---

## Key Design Decisions

**1. Client-side audit engine**
The audit logic runs in the browser. No API calls needed for core functionality. This means:
- Zero latency for results
- Works offline
- No server costs
- Fully transparent logic

**2. JSONB for audit data**
Storing the full audit as JSONB allows the schema to evolve without migrations. New fields can be added to the audit output without touching the database.

**3. Zustand over Context API**
Zustand provides a simpler API with built-in `persist` middleware. The store is typed, minimal, and easy to extend.

**4. shadcn/ui component strategy**
Components are copied into the project (not imported from a package). This means full control over styling and no version lock-in.

---

## Deployment

- **Frontend**: Vercel (automatic deploys from main branch)
- **Database**: Supabase (managed PostgreSQL)
- **Environment**: Variables set in Vercel dashboard

---
