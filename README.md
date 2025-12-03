# Simple ATM Web — React + Vite + Supabase

This repository is a simple ATM application built with React, TypeScript, Vite, Tailwind and Supabase (Postgres) as the backend. The app demonstrates basic ATM functionality: login by account number + PIN, view balance and statement, deposit, withdraw and transfer funds.

This README explains how to set up a Supabase project for this app, where to put the Supabase URL and key, and how to run the project locally so anyone can get this running on their machine.

## Quick links

- Source: `src/` (UI in `src/components/atm/`)
- Supabase client: `src/integrations/supabase/client.ts`
- Supabase types/schema: `src/integrations/supabase/types.ts`
- DB migration SQL (ready to run in Supabase): `supabase/migrations/20251203043500_8837a9e7-d2cc-4b07-b73f-a44d32e867d1.sql`

## Prerequisites

- Node.js (recommended 18+). Install from https://nodejs.org/
- A package manager: `npm` (bundled with Node), or `pnpm`/`yarn` if you prefer. The project uses Vite.
- A Supabase account (https://supabase.com/) — free tier is fine.

Optional (advanced): Supabase CLI if you want to apply migrations from the terminal: https://supabase.com/docs/guides/cli

## Environment variables

This project reads the Supabase credentials from Vite env variables. Vite requires env vars that are exposed to client code to start with `VITE_`.

You must provide at least the following variables in a local `.env` file (do NOT commit secrets to git):

- `VITE_SUPABASE_URL` — your Supabase Project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — your Supabase anon/public key

An example file is included: `.env.example` (copy it to `.env` and fill the values).

## Setting up Supabase (step-by-step)

Follow one of the two options below to prepare the database used by the app.

Option A — Recommended: Use Supabase Dashboard SQL editor

1. Create a Supabase project at https://app.supabase.com/. Pick a name and password and a region.
2. In the project, open "Settings → API" and copy the "URL" (Project URL) and the "anon/public" key. These are your `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Open "SQL Editor" in the Supabase dashboard.
4. Open the migration SQL file in this repo: `supabase/migrations/20251203043500_8837a9e7-d2cc-4b07-b73f-a44d32e867d1.sql` and paste the SQL into the SQL editor (or upload/execute). Run it. This will:
	- create `accounts` and `transactions` tables with Row Level Security enabled,
	- add trigger/function to update timestamps,
	- insert two sample accounts and initial transactions.
5. After the SQL runs successfully you should see the tables in the "Table editor".

Option B — Advanced: Use Supabase CLI / migrations

1. Install the Supabase CLI and login: https://supabase.com/docs/guides/cli
2. Link your local project to the Supabase project (follow the CLI docs to `supabase login` and `supabase link --project-ref <ref>`).
3. Apply the SQL migrations found in `supabase/migrations/` using the CLI. The exact commands change over time — consult the Supabase CLI docs — or run the SQL file directly against your connected database.

Notes on keys and safety

- The `anon/public` (publishable) key is safe for client-side use — this is what the app uses. Do NOT include the `service_role` key in any client-side bundle or committed files. The service role key has elevated privileges and must be kept secret (server-only).
- Row Level Security (RLS) is enabled in the included SQL; the sample policies are permissive so the demo works out-of-the-box. For production you must lock down policies and authentication properly.

## Local setup and running

1. Clone the repo and change into the project directory.

2. Install dependencies (example using npm):

```powershell
npm install
```

3. Create a copy of the example env and fill it with your Supabase URL + key:

```powershell
copy .env.example .env
# Then open .env and fill values (or use your editor)
```

Example `.env` values (do not commit):

VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

4. Start the dev server:

```powershell
npm run dev
```

Open http://localhost:5173 (or the URL Vite prints) and you should be able to use the ATM UI against your Supabase backend.

## Sample accounts (from migration)

The included migration seeds two accounts for testing:

- Account number: `1234567890123456` — PIN `1234` — holder: John Doe — balance: 5000.00
- Account number: `9876543210987654` — PIN `4321` — holder: Jane Smith — balance: 7500.00

Use those to log in in the Demo UI.

## Project structure (high level)

- `src/integrations/supabase/` — Supabase client and generated types. The client expects `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- `src/components/atm/` — the ATM views and UI.
- `supabase/migrations/` — SQL used to create and seed the database.

## Troubleshooting

- If the app can't connect, confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are correct in `.env` and the dev server was restarted after editing env file.
- If queries return empty results, confirm the tables exist in Supabase and the migration SQL ran successfully.
- Check browser console & network tab for errors from Supabase requests.

## Deployment notes

- For production, provide the same env vars in your hosting provider's environment configuration. Use the publishable anon key only for client operations. Any server-side jobs requiring elevated privileges should use the service role key on a secure server.
- Harden RLS policies and authentication before exposing any real user data.

## Contributing

Contributions are welcome. If you add database changes, prefer adding a new migration in `supabase/migrations/` and document the change in the PR.

---

If you'd like, I can also:

- create a `.env.example` file containing the required Vite keys (I will add that now),
- add a short script or checklist to help apply the migration via the Supabase CLI.

Tell me if you want me to add the CLI commands to this README as well.

## Supabase CLI (optional) — link project & apply migrations

If you prefer to manage migrations and development workflows from your terminal, install the Supabase CLI and use it to link to your project and apply SQL migrations.

1. Install the Supabase CLI following the official guide: https://supabase.com/docs/guides/cli
	- On Windows you can use `winget` or download the binary per the instructions.

2. Authenticate and link your local repository to your Supabase project (you'll be asked to login in the browser):

```powershell
supabase login
supabase link --project-ref <your-project-ref>
```

- The `project-ref` is a short identifier you can find in the Supabase dashboard URL or in the CLI output when listing projects. Example: `abcd1234efgh`.

3. Apply the existing migration SQL file(s) from `supabase/migrations/` to your project. The CLI command can vary between versions; a typical flow is:

```powershell
# Validate or run a migration file (example invocation — check your supabase CLI docs for exact flags)
supabase db remote set <your-db-connection-string>
supabase db push --file supabase/migrations/20251203043500_8837a9e7-d2cc-4b07-b73f-a44d32e867d1.sql
```

If `db push` is not available in your CLI version, use the CLI to open a SQL shell or run `supabase db execute`/`supabase migration apply` (refer to your CLI version docs). Alternatively, copy the SQL and paste it into the Supabase Dashboard → SQL editor.

4. Verify tables and seed data in the Supabase dashboard Table Editor.

Notes:
- The CLI is useful for automation and CI. Exact commands change as the CLI evolves; always check `supabase --help` or the docs for the version you installed.
- Do not store `service_role` keys or DB connection strings publicly.

---

Done: Supabase CLI instructions added. Next I updated `.gitignore` to ignore env files and Supabase artifacts.
