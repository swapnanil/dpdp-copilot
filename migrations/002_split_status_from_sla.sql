ALTER TABLE requests
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'OPEN' NOT NULL;

UPDATE requests
SET status = CASE
  WHEN sla_status = 'CLOSED' THEN 'CLOSED'
  ELSE COALESCE(NULLIF(status, ''), 'OPEN')
END;

CREATE INDEX IF NOT EXISTS requests_org_created_idx
  ON requests (org_id, created_at DESC);

CREATE INDEX IF NOT EXISTS evidence_events_request_org_created_idx
  ON evidence_events (request_id, org_id, created_at);
