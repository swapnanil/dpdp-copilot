import { query } from './db'
import { v4 as uuid } from 'uuid'
import { getCurrentOrg } from './orgService'

export async function logEvidence(requestId, eventType, eventData = {}) {
  const org = await getCurrentOrg()
  const orgId = org.id
  await query(
    `INSERT INTO evidence_events (id, request_id, event_type, event_data, org_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [uuid(), requestId, eventType, eventData, orgId]
  )
}
