# Architecture — AI Spend Audit Tool

## System Overview

The AI Spend Audit Tool is a client-heavy web application. Audit logic runs in the browser; Supabase is optional for persistence.

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────┐   │
│  │ Landing  │───▶│ Multi-step   │───▶│  Results    │   │
│  │    /     │    │ Form /audit  │    │  /results   │   │
│  └──────────┘    └──────┬───────┘    └──────┬──────┘   │
│                         │                    │          │
│                ┌────────▼────────┐         │          │
│                │  Zustand Store   │─────────┘          │
│                │  (localStorage)  │                    │
│                └────────┬─────────┘                    │
│                         │                              │
│                ┌────────▼─────────┐                    │
│                │  Audit Engine    │                    │
│                │  + config/pricing│                    │
│                └──────────────────┘                    │
└─────────────────────────────────────────────────────────┘
                              │
                    (optional)  ▼
                    ┌────────────────────┐
                    │     Supabase       │
                    └────────────────────┘
```

---

## Frontend Structure

```
frontend/
├── app/
│   ├── page.tsx              # Landing
│   ├── audit/page.tsx        # Multi-step form
│   └── results/page.tsx      # Audit results
├── components/
│   ├── audit/                # Form, results, steps
│   ├── landing/              # Hero, features, CTA, footer
│   ├── layout/               # Nav, PageShell
│   └── ui/
├── config/
│   ├── pricing.ts            # Plans, prices, source URLs
│   └── tools.ts              # Tool list, thresholds
├── hooks/
│   └── use-store-hydration.ts
├── lib/
│   ├── audit-engine.ts
│   ├── supabase.ts
│   └── utils.ts
├── store/
│   └── audit-store.ts
└── types/
    └── audit.ts
```

---

## Data Flow

1. User completes multi-step form at `/audit`
2. Each change syncs to Zustand → localStorage (`ai-spend-audit`)
3. Submit runs `runAudit()` using `config/pricing.ts` reference data
4. Results stored in Zustand; router navigates to `/results`
5. Optional: `saveAudit()` to Supabase

---

## Audit Engine Rules

| Rule | Condition | Recommendation |
|------|-----------|----------------|
| R1 | ChatGPT Team, ≤2 seats | Downgrade to Plus |
| R2 | Claude Team, ≤3 seats | Downgrade to Pro |
| R3 | API spend > $500/mo | Credex consultation |
| R4 | Enterprise + team < 5 | Downgrade to Team |
| R5 | Paying >115% of list price | Wrong plan selection |
| R6 | Seats > team size × 1.2 | Remove unused seats |
| R7 | Copilot Business, ≤3 seats | Downgrade to Pro |
| R8 | Cursor Business, ≤2 seats | Downgrade to Pro |
| R9 | Windsurf Team, ≤2 seats | Downgrade to Pro |
| R10 | API $100–$500/mo | Model optimization |

---

## Pricing Configuration

All list prices and official URLs live in `frontend/config/pricing.ts`. The audit engine and form both import from this module — update prices in one place.

---

## Deployment

- **Frontend**: Vercel (`frontend/` root, `vercel.json`)
- **Database**: Supabase (optional)
- **Secrets**: `.env.local` only — never committed

---
