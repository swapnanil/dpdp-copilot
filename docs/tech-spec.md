# DPDP Copilot Technical Specification

## Stack

- Framework: Next.js 14 App Router.
- Runtime: Node.js for API routes that use PostgreSQL, OpenAI, and Puppeteer.
- UI: React client components with inline styles.
- Database: PostgreSQL through `pg`.
- AI provider: OpenAI chat completions.
- PDF generation: Puppeteer with Chromium.
- Deployment packaging: Next.js standalone output via Docker.

## Application Structure

```text
app/
  (auth)/login/page.js                 Login UI
  grievance/page.js                    Public request intake form
  page.js                              Operator inbox
  requests/[id]/page.js                Operator request detail
  api/login/route.js                   Admin login
  api/logout/route.js                  Logout
  api/requests/route.js                Request list and create
  api/requests/[id]/route.js           Request detail and evidence
  api/requests/[id]/send-reply/route.js
  api/requests/[id]/export/csv/route.js
  api/requests/[id]/export/pdf/route.js
lib/
  db.js                                PostgreSQL pool and query helper
  llm.js                               OpenAI classification and reply drafting
  sla.js                               SLA status calculation
  orgContext.js                        Current organization selection
  orgService.js                        Organization lookup
  evidence.js                          Evidence event writer
  pdfTemplates/evidenceReport.js       Evidence report HTML template
middleware.js                          Cookie-based route protection
pg.dump                                Database schema dump
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string.
- `OPENAI_API_KEY`: OpenAI API key for classification and drafting.
- `ADMIN_USER`: Admin username.
- `ADMIN_PASS`: Admin password.
- `DEFAULT_ORG_ID`: Active organization UUID.
- `NODE_ENV`: Enables SSL configuration for production database connections.
- `PUPPETEER_EXECUTABLE_PATH`: Set in Docker to use Alpine Chromium.

## Data Model

### `orgs`

- `id uuid primary key`
- `name text not null`
- `created_at timestamptz default now()`
- `sla_days integer default 7 not null`

### `requests`

- `id uuid primary key`
- `message text not null`
- `type text not null`
- `suggested_reply text`
- `sla_status text`
- `created_at timestamptz default now() not null`
- `sla_due_at timestamptz`
- `org_id uuid not null references orgs(id)`

### `evidence_events`

- `id uuid primary key`
- `request_id uuid references requests(id)`
- `event_type text not null`
- `event_data jsonb`
- `created_at timestamptz default now() not null`
- `org_id uuid not null references orgs(id)`

## Request Lifecycle

1. `POST /api/requests` reads `{ message, language }`.
2. The route resolves the active org through `DEFAULT_ORG_ID`.
3. It creates a request with type `PENDING`, `sla_status` set to `OPEN`, and `sla_due_at` set to now plus 7 days.
4. It logs `REQUEST_CREATED`.
5. It calls OpenAI to classify the message.
6. It updates `requests.type`.
7. It logs `REQUEST_CLASSIFIED`.
8. It calls OpenAI to draft a reply.
9. It updates `requests.suggested_reply`.
10. It logs `REPLY_SUGGESTED`.
11. It returns `{ id, type, reply }`.

## SLA Semantics

`computeSlaStatus(slaDueAt)` computes status at read time:

- `UNKNOWN` when `sla_due_at` is missing.
- `OVERDUE` when the due date is in the past.
- `DUE_SOON` when fewer than 24 hours remain.
- `WITHIN_SLA` otherwise.

The create route also writes `sla_status = 'OPEN'`, and the send-reply route writes `sla_status = 'CLOSED'`. Because read paths recompute SLA from `sla_due_at`, the persisted `sla_status` field currently mixes workflow status and SLA status.

## Organization Scoping

Application queries scope request and evidence access by `org_id`. The active organization is read from `process.env.DEFAULT_ORG_ID`, not from the authenticated user or request host. This is adequate for a single-tenant deployment but not for true multi-tenant use.

## Authentication And Authorization

The app uses a basic cookie named `auth`:

- `POST /api/login` compares submitted credentials to `ADMIN_USER` and `ADMIN_PASS`.
- On success it sets `auth=true` as an HTTP-only cookie.
- `middleware.js` redirects unauthenticated requests to `/login`.
- `/login`, `/api/login`, `/api/logout`, and `/_next` are public.

There is no signed session, user table, role model, CSRF protection, password hashing, account lockout, or per-user organization authorization.

## AI Integration

`lib/llm.js` uses `gpt-4o-mini` through chat completions:

- `classifyRequest(text)` asks the model to classify the message into one of four labels.
- `draftReply(text, type, language)` asks the model for a polite DPDP-compliant reply.

Current outputs are plain text and are not schema-validated. The application assumes the classification result can be stored directly in `requests.type`.

## Evidence Generation

Evidence is append-only at the application level through `logEvidence(requestId, eventType, eventData)`. Events are stored with active `org_id`, event data JSON, and database timestamp.

Exports:

- CSV export emits `event_type,created_at`.
- PDF export renders HTML and converts it to PDF with Puppeteer.

## Deployment

The Dockerfile:

- Uses `node:20-alpine`.
- Installs Chromium and font dependencies for Puppeteer.
- Runs `npm install`.
- Runs `npm run build`.
- Sets `NODE_ENV=production` and `PORT=3000`.
- Copies `.next/static` into the standalone output.
- Starts `.next/standalone/server.js`.

## Local Development

Expected commands:

```bash
npm install
npm run dev
npm run build
```

The repository does not currently define test, lint, format, migration, or seed scripts.

## Initial Technical Review Findings

- `app/api/requests/[id]/route.js` does not check whether a request exists before reading `request.sla_due_at`, so an unknown ID can produce a server error.
- `middleware.js` marks `/api/requests` as protected, which conflicts with `/grievance` submitting to that API as a public page unless middleware behavior is changed or public intake gets a separate route.
- The `/login` redirect branch for already-authenticated users is unreachable because `/login` is returned as public before the branch executes.
- `lib/pdfTemplates/evidenceReport.js` interpolates user-provided request fields directly into HTML without escaping.
- AI prompts interpolate raw user text and do not request structured JSON output, which makes classification brittle.
- `POST /api/requests` has no validation for missing or non-string `message` and `language`.
- Authentication uses a static unsigned cookie value, so it should not be treated as production-grade access control.
- `DEFAULT_ORG_ID` is required even for rendering the login layout because `app/layout.js` resolves the organization globally.
- There is a duplicate unused `lib/middleware.js` that differs from root `middleware.js`.
- The Dockerfile copies `package-lock.json*`, but the repository does not currently include a lockfile.

## Recommended Next Steps

1. Split workflow status from SLA status in the data model and UI.
2. Add request validation and not-found handling to all API routes.
3. Move public intake to a dedicated unauthenticated endpoint or explicitly allow `POST /api/requests`.
4. Escape HTML in PDF templates.
5. Replace free-form AI classification with schema-constrained output and whitelist validation.
6. Add database migrations and seed data instead of relying on a raw dump.
7. Add unit tests for SLA, evidence logging, route validation, and export rendering.
8. Replace static cookie auth with signed sessions and explicit user-to-org authorization before production use.

