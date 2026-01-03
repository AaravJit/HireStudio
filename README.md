# HireStudio

HireStudio is a production-ready SaaS web app for generating ATS-friendly, tailored resumes from a single Master Profile. It includes onboarding, batch job intake, AI-powered resume generation, ATS checks, export (PDF/DOCX/ZIP), and Stripe-based billing.

## Tech stack
- Next.js App Router + TypeScript
- TailwindCSS + shadcn-style UI components
- Auth.js (NextAuth) + Prisma adapter
- Postgres + Prisma ORM
- OpenAI Responses API (provider-agnostic wrapper)
- PDF: @react-pdf/renderer
- DOCX: docx
- ZIP: jszip
- Stripe Checkout + Customer Portal + Webhooks

## Setup

### 1) Install dependencies
```bash
pnpm i
```

### 2) Environment variables
Create a `.env` file:

```bash
# Core
DATABASE_URL=postgresql://user:password@localhost:5432/hirestudio
AUTH_SECRET=your_auth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=local-dev-secret

# Email magic links (SMTP)
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASSWORD=your_password
EMAIL_FROM="HireStudio <hello@hirestudio.ai>"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_ENABLED=false

# OpenAI
OPENAI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_PRO=

# Upstash rate limiting (optional)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Vercel Blob (optional)
BLOB_READ_WRITE_TOKEN=
```

### 3) Prisma migrations
```bash
pnpm prisma generate
pnpm prisma migrate dev
```

### 4) Seed sample data
```bash
pnpm seed
```

### 5) Run the app
```bash
pnpm dev
```

### 6) Background worker
In development, run the worker to process queued generation jobs:
```bash
pnpm worker
```

In production (Vercel), configure a cron to call:
```
GET /api/cron/worker (x-cron-secret: <CRON_SECRET>)
```

## Stripe setup
1. Create a Stripe product + recurring price.
2. Set `STRIPE_PRICE_ID_PRO` to the price ID.
3. Configure a webhook endpoint pointing to:
```
https://<your-domain>/api/stripe/webhook
```
4. Add the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.

Local webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Vercel deployment
1. Push the repo to GitHub.
2. Create a Vercel project and set env vars.
3. Provision managed Postgres and update `DATABASE_URL`.
4. Add a Vercel Cron job to hit `/api/cron/worker`.

## Tests
```bash
pnpm test
```

## Notes
- Free tier: 2 tailored resumes/month, PDF export only.
- Pro tier: unlimited, DOCX + ZIP exports, advanced ATS check.
- AI provider is modular in `src/lib/ai` for easy swapping.
