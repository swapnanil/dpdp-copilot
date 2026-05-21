CREATE TABLE IF NOT EXISTS orgs (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  sla_days integer DEFAULT 7 NOT NULL
);

CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY,
  message text NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'OPEN' NOT NULL,
  suggested_reply text,
  sla_status text,
  created_at timestamptz DEFAULT now() NOT NULL,
  sla_due_at timestamptz,
  org_id uuid NOT NULL REFERENCES orgs(id)
);

CREATE TABLE IF NOT EXISTS evidence_events (
  id uuid PRIMARY KEY,
  request_id uuid REFERENCES requests(id),
  event_type text NOT NULL,
  event_data jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  org_id uuid NOT NULL REFERENCES orgs(id)
);

CREATE INDEX IF NOT EXISTS requests_org_created_idx
  ON requests (org_id, created_at DESC);

CREATE INDEX IF NOT EXISTS evidence_events_request_org_created_idx
  ON evidence_events (request_id, org_id, created_at);
