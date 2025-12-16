// app/api/requests/[id]/send-reply/route.js

import { query } from '../../../../../lib/db'
import { logEvidence } from '../../../../../lib/evidence'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req, { params }) {
  const { id } = params

  // Fetch request
  const res = await query(
    'SELECT * FROM requests WHERE id = $1',
    [id]
  )

  const request = res.rows[0]
  if (!request) {
    return new Response('Not found', { status: 404 })
  }

  // 👉 Simulated send (email/SMS later)
  // At this stage, "sending" means operator approved & dispatched

  await logEvidence(id, 'REPLY_SENT', {
    channel: 'manual',
    content: request.suggested_reply
  })

  // Mark request closed
  await query(
    `UPDATE requests
     SET sla_status = 'CLOSED'
     WHERE id = $1`,
    [id]
  )

  return Response.json({ ok: true })
}
