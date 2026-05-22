# TennisEdge

Professional tennis betting intelligence platform with Supabase database.

## Features

- Live tennis predictions from The Odds API
- Bankroll management saved to Supabase
- Betting journal with database storage
- Analytics dashboard
- Underdog set betting analysis

## Deploy to Vercel

### Step 1: Push to GitHub
```bash
cd tennisaiv1
git init
git add .
git commit -m "Initial TennisEdge"
git remote add origin https://github.com/jasonofem/tennisaiv1.git
git branch -M main
git push -u origin main
```

### Step 2: Add Environment Variables in Vercel

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mqkdxtlgdvkxpzefponn.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa2R4dGxnZHZreHB6ZWZwb25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMzMwMTQsImV4cCI6MjA5NDkwOTAxNH0.GkR9KG-amLt-IZ3dwKA1Eur43ZhdqF-PoKUSRLIko0E` |

### Step 3: Create Supabase Tables

Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT UNIQUE, name TEXT, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE bankroll (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id TEXT, total_amount FLOAT DEFAULT 100000, unit_size FLOAT DEFAULT 2000, current_amount FLOAT DEFAULT 100000, daily_risk_percent FLOAT DEFAULT 5, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
CREATE TABLE predictions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id TEXT, match_id TEXT, tournament TEXT, player1 TEXT, player2 TEXT, underdog TEXT, odds FLOAT, edge_percent FLOAT, confidence TEXT, suggested_units INT, status TEXT DEFAULT 'pending', result TEXT, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE journal_entries (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id TEXT, tournament TEXT, player1 TEXT, player2 TEXT, underdog TEXT, odds FLOAT, units INT, stake_amount FLOAT, edge_percent FLOAT, confidence TEXT, result TEXT, profit_loss FLOAT, notes TEXT, created_at TIMESTAMP DEFAULT NOW());

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bankroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON users FOR ALL USING (true);
CREATE POLICY "allow_all" ON bankroll FOR ALL USING (true);
CREATE POLICY "allow_all" ON predictions FOR ALL USING (true);
CREATE POLICY "allow_all" ON journal_entries FOR ALL USING (true);
```

## Usage

1. Go to Settings page
2. Enter your Odds API key
3. Click "Test Connection"
4. Dashboard will show live tennis matches

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- The Odds API