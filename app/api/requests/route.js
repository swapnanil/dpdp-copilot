// ================================
// app/api/requests/route.js
// ================================
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { query } from '../../../lib/db'
import { classifyRequest, draftReply } from '../../../lib/llm'
import { v4 as uuid } from 'uuid'
import { logEvidence } from '../../../lib/evidence'


export async function GET() {
    const res = await query('SELECT * FROM requests ORDER BY created_at DESC')
    return Response.json(res.rows)
}


export async function POST(req) {
  const body = await req.json()
  const { message, language } = body

  const id = uuid()

  // 1️⃣ Store request
  await query(
    `INSERT INTO requests (id, message, type, sla_status)
     VALUES ($1, $2, $3, $4)`,
    [id, message, 'PENDING', 'OPEN']
  )

  await logEvidence(id, 'REQUEST_CREATED', {
    source: 'public_form'
  })

  // 2️⃣ Classify
  const type = await classifyRequest(message)

  await query(
    `UPDATE requests SET type = $1 WHERE id = $2`,
    [type, id]
  )

  await logEvidence(id, 'REQUEST_CLASSIFIED', {
    type
  })

  // 3️⃣ Draft reply
  const reply = await draftReply(message, type, language)

  await query(
    `UPDATE requests SET suggested_reply = $1 WHERE id = $2`,
    [reply, id]
  )

  await logEvidence(id, 'REPLY_SUGGESTED', {
    language
  })

  return Response.json({ id, type, reply })
}
