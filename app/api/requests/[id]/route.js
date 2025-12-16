// app/api/requests/[id]/route.js

import { query } from '../../../../lib/db'
import { computeSlaStatus } from '../../../../lib/sla'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req, { params }) {
    const { id } = params

    const requestRes = await query(
        'SELECT * FROM requests WHERE id = $1',
        [id]
    )

    const evidenceRes = await query(
        `SELECT id, event_type, created_at
     FROM evidence_events
     WHERE request_id = $1
     ORDER BY created_at ASC`,
        [id]
    )

    const request = requestRes.rows[0]

    return Response.json({
        request: {
            ...request,
            sla_status: computeSlaStatus(request.sla_due_at)
        },
        evidence: evidenceRes.rows
    })

}
