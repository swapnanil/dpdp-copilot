import { query } from './db'
import { v4 as uuid } from 'uuid'
import { getCurrentOrgId } from './orgContext'

export async function logEvidence(requestId, eventType, eventData = {}) {
  const orgId = getCurrentOrgId()
  await query(
    `INSERT INTO evidence_events (id, request_id, event_type, event_data, org_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [uuid(), requestId, eventType, eventData, orgId]
  )
}
