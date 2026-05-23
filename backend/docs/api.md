# API Documentation

## Overview

The AI Spend Audit Tool uses Supabase as its backend. All database interactions go through the Supabase JavaScript client using the anon key with Row Level Security.

---

## Supabase Tables

### POST /audits (via Supabase client)

Saves an audit result to the database.

**Request body (audit_data JSONB):**
```json
{
  "tools": [
    {
      "tool": "ChatGPT",
      "plan": "Team",
      "monthlyCost": 30,
      "seats": 2,
      "teamSize": 2,
      "useCase": "Writing"
    }
  ],
  "results": {
    "totalMonthlySavings": 10,
    "totalAnnualSavings": 120,
    "recommendations": [...],
    "toolBreakdowns": [...]
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "created_at": "2026-05-23T..."
}
```

---

### POST /leads (via Supabase client)

Captures lead information after audit completion.

**Request body:**
```json
{
  "email": "user@company.com",
  "company": "Acme Corp",
  "role": "Engineering Manager",
  "team_size": 12,
  "audit_id": "uuid-from-audits-table"
}
```

---

## Error Handling

All Supabase calls return `{ data, error }`. The frontend handles errors gracefully:
- If Supabase is not configured → audit still works, save is skipped silently
- If save fails → user sees audit results, error is logged to console
- No user-facing errors for optional persistence

---

## Future Endpoints (Day 2+)

- Supabase Edge Function: send audit summary email
- Supabase Edge Function: generate PDF report
- Admin dashboard: read audits with service_role key
