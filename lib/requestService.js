import { v4 as uuid } from 'uuid'
import { query } from './db'
import { classifyRequest, draftReply } from './llm'
import { logEvidence } from './evidence'
import { getCurrentOrg } from './orgService'

export async function createDpdpRequest({ message, language, source }) {
  const org = await getCurrentOrg()
  const orgId = org.id
  const id = uuid()

  const slaDays = Number.isInteger(org.sla_days) ? org.sla_days : 7
  const slaDueAt = new Date()
  slaDueAt.setDate(slaDueAt.getDate() + slaDays)

  await query(
    `INSERT INTO requests (id, message, type, status, sla_due_at, org_id)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, message, 'PENDING', 'OPEN', slaDueAt, orgId]
  )

  await logEvidence(id, 'REQUEST_CREATED', { source })

  let type = 'Grievance'
  try {
    type = await classifyRequest(message)
  } catch (err) {
    console.error('Classification failed, defaulting to Grievance:', err.message)
  }

  await query(
    `UPDATE requests
     SET type = $1
     WHERE id = $2
     AND org_id = $3`,
    [type, id, orgId]
  )

  await logEvidence(id, 'REQUEST_CLASSIFIED', { type })

  let reply = null
  try {
    reply = await draftReply(message, type, language)
  } catch (err) {
    console.error('Reply drafting failed:', err.message)
  }

  if (reply) {
    await query(
      `UPDATE requests
       SET suggested_reply = $1
       WHERE id = $2
       AND org_id = $3`,
      [reply, id, orgId]
    )
    await logEvidence(id, 'REPLY_SUGGESTED', { language })
  }

  return { id, type, reply }
}
