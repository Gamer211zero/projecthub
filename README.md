# ProjectHub India

A simple cross-college platform where students in India can post projects, discover work from other colleges, and request to collaborate.

## Included

- Email/password registration and login with bcrypt-hashed passwords and an httpOnly JWT cookie
- Browse, keyword search, college/state/technology/status filters, shareable URLs, and pagination
- Create, view, edit, and delete projects with server-side ownership checks
- Collaboration requests with optional messages, duplicate prevention, and accept/reject actions
- Dashboard for projects, incoming requests, and sent-request status
- Private chat between project owners and accepted collaborators
- Skill-based project recommendations with editable student skill profiles
- Faculty verification using one-time, per-project codes
- In-app notifications plus optional transactional email through Resend
- Live platform analytics by technology and state
- Anonymous built-in student survey with live, real-response-only results
- Responsive, neutral UI with loading, empty, 404, and error states
- Idempotent demo seed with 8 users, 18 clearly labelled projects, and sample requests
- PostgreSQL migration ready for Neon, Supabase, or another hosted PostgreSQL database

## Local setup

Requirements: Node.js 20+ or Bun, and PostgreSQL.

```bash
bun install
cp .env.example .env
```

Set `DATABASE_URL` and generate a strong `SESSION_SECRET` in `.env`. Faculty verification codes are generated separately for each project and do not require an environment variable. Email notifications work after adding `RESEND_API_KEY` and `EMAIL_FROM`; in-app notifications work without email configuration. Then:

```bash
bun run db:setup
bun run dev
```

Open `http://localhost:3000`.

All seeded accounts use password `Demo@123`. Useful accounts:

- `asha@example.com`
- `rohan@example.com`
- `meera@example.com`

Seed records are labelled **Demo data** in the UI. Running `bun run db:seed` again replaces demo projects but preserves real projects.

## Database commands

```bash
bun run db:deploy   # apply committed migrations (production-safe)
bun run db:seed     # add demo users/projects/requests
bun run db:studio   # inspect records locally
bun run db:setup    # deploy migrations, then seed
```

For future schema changes during development:

```bash
bunx prisma migrate dev --name describe_the_change
```

## Vercel + Neon deployment

1. Create a Neon PostgreSQL database and copy its pooled connection URL.
2. Import this repository into Vercel.
3. Add `DATABASE_URL` and a random 32+ character `SESSION_SECRET` to Vercel for Production, Preview, and Development.
4. Before the first deployment, apply the migration and optional demo data from your machine:

```bash
DATABASE_URL="your-neon-url" bun run db:deploy
DATABASE_URL="your-neon-url" bun run db:seed
```

5. Deploy. Vercel runs `bun run build`, which generates the Prisma client first.

Share `/survey` with students to collect responses and use `/survey/results` for live aggregates. Share `/analytics` for platform usage figures. Chat appears after a collaboration request is accepted.

Do not commit `.env`. If a database URL is pasted into chat, an issue, or a public log, rotate the database password before deployment.

## Verification

```bash
bun run lint
bun run build
```

## Git workflow

The current repository began as a starter on `master`. To adopt the requested weekly-history workflow from now on:

```bash
git branch -M main
git checkout -b week1-foundation
git add .
git commit -m "feat: build ProjectHub foundation and core workflows"
git push -u origin week1-foundation
```

Do not backdate commits. Open a PR, merge with `--no-ff`, then tag the merge. Because the complete semester scope was implemented in one pass, use future weekly branches for testing, survey feedback, deployment, and polish rather than manufacturing an artificial history.
"# projecthub" 
