// app/api/requests/[id]/send-reply/route.js


export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { query } from '../../../../../lib/db'
import { logEvidence } from '../../../../../lib/evidence'
import { getCurrentOrg } from '../../../../../lib/orgService'

export async function POST(req, { params }) {
  const org = await getCurrentOrg()
  const orgId = org.id
  const { id } = params

  // Fetch request
  const res = await query(
    'SELECT * FROM requests WHERE id = $1 AND org_id = $2',
    [id, orgId]
  )

  const request = res.rows[0]
  if (!request) {
    return new Response('Not found', { status: 404 })
  }

  // 👉 Simulated send (email/SMS later)
  // At this stage, "sending" means operator approved & dispatched

    // Check if reply already sent
    const sentRes = await query(
        `SELECT 1
        FROM evidence_events
        WHERE request_id = $1
        AND event_type = 'REPLY_SENT'
        AND org_id = $2
        LIMIT 1`,
        [id, orgId]
    )

    if (sentRes.rows.length > 0) {
        return Response.json(
            { ok: true, alreadySent: true },
            { status: 200 }
        )
    }

  await logEvidence(id, 'REPLY_SENT', {
    channel: 'manual',
    content: request.suggested_reply
  })

  // Mark request closed
  await query(
    `UPDATE requests
     SET status = 'CLOSED'
     WHERE id = $1
     AND org_id = $2`,
    [id, orgId]
  )

  return Response.json({ ok: true })
}
