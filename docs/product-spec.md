# DPDP Copilot Product Specification

## Purpose

DPDP Copilot is an operator tool for receiving, triaging, responding to, and evidencing data principal requests under India's Digital Personal Data Protection Act. The current product focuses on a simple compliance workflow: capture a public request, classify it, draft an operator reply, track SLA status, and export an evidence trail.

## Target Users

- Data principals who need to submit a grievance or personal data request.
- Compliance operators who review incoming requests and dispatch responses.
- Compliance or audit reviewers who need evidence that requests were handled.

## Core Workflows

### Public Request Intake

Data principals submit a request from `/grievance` with:

- Contact detail, currently embedded into the message body.
- Free-form request message.
- Preferred response language.

On submission, the system creates a request, assigns an SLA due date, records intake evidence, classifies the request, drafts a suggested response, and records the automation steps in the evidence log.

### Operator Inbox

Authenticated operators land on `/`, which lists requests for the active organization. Each request shows:

- Request type.
- Message preview.
- Computed SLA status.

The inbox links to a detailed request page.

### Request Review

The request detail page at `/requests/[id]` shows:

- Request type and creation timestamp.
- SLA status.
- Resolution checklist.
- Suggested reply.
- Original request message.
- Evidence timeline.
- Evidence export links.

Operators can mark a suggested reply as sent. The current implementation simulates sending by logging `REPLY_SENT` and updating the request status field to `CLOSED`.

### Evidence Export

Operators can export the evidence trail for a request as:

- CSV from `/api/requests/[id]/export/csv`.
- PDF from `/api/requests/[id]/export/pdf`.

The PDF includes organization name, request metadata, original message, suggested reply, and evidence timeline.

## Functional Requirements

- The system must accept public data principal requests without operator login.
- The system must protect operator pages and APIs behind login.
- The system must classify each request into one of `Grievance`, `Access`, `Rectification`, or `Deletion`.
- The system must draft a suggested response in the submitter's preferred language.
- The system must compute SLA status from `sla_due_at`.
- The system must retain an evidence log for request creation, classification, reply suggestion, and reply send events.
- The system must scope requests and evidence by organization.
- The system must support exportable evidence for audit review.

## Current Product Behavior

- Authentication is a single environment-backed admin username and password.
- Organization context is selected through `DEFAULT_ORG_ID`.
- SLA duration is hard-coded to 7 days in the request creation API.
- The `orgs.sla_days` database field exists but is not used by the application.
- The reply send workflow does not send email, SMS, or in-app notification; it records manual dispatch.
- Contact details are stored inside the free-form message rather than a dedicated field.
- SLA display treats any non-overdue and non-due-soon status as "Within SLA", including closed requests.

## Non-Goals In Current Version

- Full identity verification for data principals.
- Multi-user role-based access control.
- Real outbound email/SMS delivery.
- Request assignment, notes, or internal collaboration.
- DPDP legal determination or guaranteed compliance certification.
- Data discovery or fulfillment automation against source systems.

## Open Product Questions

- Should the SLA be configurable per organization using `orgs.sla_days`?
- What statuses should exist beyond the current `sla_status` field, such as `OPEN`, `IN_REVIEW`, `WAITING_ON_USER`, `RESPONDED`, and `CLOSED`?
- Should contact information be modeled as structured data with validation and retention controls?
- What approval steps are required before a suggested reply can be dispatched?
- Which channels should be supported for actual reply delivery?
- What evidence details are required for auditors beyond event type and timestamp?

## Initial Product Risks

- The current login model is suitable only for a prototype or internal demo.
- AI-generated classification and replies are not constrained to structured output, so request type and reply quality can vary.
- Contact data is handled as plain text in the request message, which limits validation, search, retention, and redaction.
- Evidence exports may include unescaped user-provided content in generated HTML.
- SLA and closure are conflated in the `sla_status` field, which can confuse reporting.

