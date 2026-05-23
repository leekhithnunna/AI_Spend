# Supabase Setup Guide

## 1. Create a Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Choose your organization
4. Set project name: `ai-spend-audit`
5. Set a strong database password (save it!)
6. Choose region closest to your users
7. Click **Create new project** (takes ~2 minutes)

## 2. Run the Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Paste the contents of `backend/sql/001_initial_schema.sql`
4. Click **Run** (or Ctrl+Enter)
5. You should see: `Success. No rows returned`

## 3. Get Your API Keys

1. Go to **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Paste into `frontend/.env.local`

## 4. Verify Tables

Go to **Table Editor** — you should see:
- `audits` table
- `leads` table

## 5. Test the Connection

Run the frontend locally and submit an audit. Check the `audits` table in Supabase to confirm data is being saved.

---

## Security Notes

- The `anon` key is safe to expose in the frontend (it's public by design)
- Row Level Security (RLS) is enabled — anon users can only INSERT, not SELECT
- Never expose the `service_role` key in frontend code
- The `service_role` key should only be used in server-side code or Edge Functions
