import { query } from './db'
import { v4 as uuid } from 'uuid'

export async function logEvidence(requestId, eventType, eventData = {}) {
  await query(
    `INSERT INTO evidence_events (id, request_id, event_type, event_data)
     VALUES ($1, $2, $3, $4)`,
    [uuid(), requestId, eventType, eventData]
  )
}
