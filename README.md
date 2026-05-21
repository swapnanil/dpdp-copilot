# DPDP Copilot

**[llm-tools](https://swapnanilsaha.com) suite by Swapnanil Saha**

India's DPDP Act 2023 gives every data principal the right to access, correct, or delete their personal data — and organisations a 7-day window to respond. Most teams handle this with a shared inbox and no process, leading to missed SLAs, inconsistent replies, and zero audit trail. **DPDP Copilot** closes that gap: a self-hosted operator tool that accepts public data requests, classifies them with Claude, drafts a compliant multilingual reply, and tracks every action as immutable evidence.

---

## Features

| # | Feature | What it does |
|---|---------|--------------|
| 1 | **Request Intake** | Public form at `/grievance` accepts requests in 5 Indian languages. No login required for data principals. |
| 2 | **AI Classification** | Claude `claude-sonnet-4-6` classifies each request as Grievance, Access, Rectification, or Deletion. |
| 3 | **Multilingual Reply Drafting** | Claude drafts a DPDP-compliant reply in the language the data principal chose — English, Hindi, Bengali, Tamil, or Marathi. |
| 4 | **Operator Inbox** | Authenticated staff view all requests, see SLA status (Within SLA / Due Soon / Overdue), and send replies in one click. |
| 5 | **Evidence Timeline** | Every action (received, classified, reply drafted, reply sent) is logged to an append-only evidence table with timestamps. |
| 6 | **SLA Monitoring** | Configurable per-organisation SLA (default 7 days). Requests automatically progress through WITHIN_SLA → DUE_SOON → OVERDUE. |
| 7 | **PDF / CSV Export** | Export the full evidence timeline as a PDF or CSV for regulatory audit or internal records. |

---

## Quick Start (Docker)

```bash
cp .env.example .env                      # add ANTHROPIC_API_KEY and credentials
docker compose up db -d                   # start Postgres
docker compose run --rm migrate           # run migrations
docker compose up app                     # start the app on :3000
```

Open `http://localhost:3000` for the operator inbox.
Open `http://localhost:3000/grievance` for the public request form.

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/public/requests` | None | Submit a new data principal request |
| `POST` | `/api/login` | None | Operator login |
| `POST` | `/api/logout` | None | Operator logout |
| `GET` | `/api/requests` | Operator | List all requests with live SLA status |
| `GET` | `/api/requests/:id` | Operator | Get request detail + evidence timeline |
| `POST` | `/api/requests/:id/send-reply` | Operator | Mark reply as sent, close request |
| `GET` | `/api/requests/:id/export/pdf` | Operator | Download PDF evidence report |
| `GET` | `/api/requests/:id/export/csv` | Operator | Download CSV evidence export |

---

## Sample Input → Output

**Input** (public form submission):
```json
{
  "message": "[Contact: user@example.com]\nI would like to request deletion of all personal data you hold about me.",
  "language": "English",
  "source": "public_form"
}
```

**Output** (operator inbox entry):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "type": "Deletion",
  "status": "OPEN",
  "sla_status": "WITHIN_SLA",
  "sla_due_at": "2025-06-01T10:00:00Z",
  "suggested_reply": "Dear Data Principal,\n\nThank you for your request for deletion of personal data under Section 13 of the Digital Personal Data Protection Act, 2023...",
  "evidence": [
    { "event_type": "REQUEST_CREATED", "created_at": "2025-05-25T10:00:00Z" },
    { "event_type": "REQUEST_CLASSIFIED", "created_at": "2025-05-25T10:00:01Z" },
    { "event_type": "REPLY_SUGGESTED", "created_at": "2025-05-25T10:00:02Z" }
  ]
}
```

---

## Output Schema

```json
{
  "id": "uuid",
  "type": "Grievance | Access | Rectification | Deletion",
  "status": "OPEN | CLOSED",
  "sla_status": "WITHIN_SLA | DUE_SOON | OVERDUE",
  "sla_due_at": "ISO 8601 timestamp",
  "suggested_reply": "string | null",
  "message": "string",
  "created_at": "ISO 8601 timestamp",
  "evidence": [
    {
      "id": "uuid",
      "event_type": "REQUEST_CREATED | REQUEST_CLASSIFIED | REPLY_SUGGESTED | REPLY_SENT",
      "metadata": "object",
      "created_at": "ISO 8601 timestamp"
    }
  ]
}
```

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | — | **Required.** Your Anthropic API key. |
| `MODEL` | `claude-sonnet-4-6` | Claude model for classification and reply drafting. |
| `MAX_TOKENS` | `1024` | Max tokens for reply drafts. |
| `DATABASE_URL` | — | **Required.** PostgreSQL connection string. |
| `ADMIN_USER` | — | **Required.** Operator login username. |
| `ADMIN_PASS` | — | **Required.** Operator login password. |
| `DEFAULT_ORG_ID` | — | **Required.** UUID of the active organisation (from `orgs` table after seeding). |
| `ADMIN_SESSION_SECRET` | — | Required in production. Signs session cookies. Generate with `openssl rand -hex 32`. |
| `PUPPETEER_EXECUTABLE_PATH` | — | Chromium path for PDF export. Set automatically in Docker. |

---

## Live Demo

[swapnanil.github.io/dpdp-copilot](https://swapnanil.github.io/dpdp-copilot)

---

Built by **Swapnanil Saha** — [swapnanilsaha.com](https://swapnanilsaha.com)
