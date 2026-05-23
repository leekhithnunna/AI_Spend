# Backend — AI Spend Audit Tool

The backend is powered by **Supabase** (managed PostgreSQL + Auth + Storage).

## Structure

```
backend/
├── supabase/
│   └── config.md           # Setup guide
├── sql/
│   └── 001_initial_schema.sql  # Database migration
└── docs/
    └── api.md              # API documentation
```

## Quick Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run `backend/sql/001_initial_schema.sql` in the SQL Editor
3. Copy your API keys to `frontend/.env.local`

See `supabase/config.md` for detailed instructions.
