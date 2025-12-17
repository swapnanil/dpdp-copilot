// app/api/requests/[id]/route.js
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { query } from '../../../../lib/db'
import { computeSlaStatus } from '../../../../lib/sla'
import { getCurrentOrg } from '../../../../lib/orgService'

export async function GET(req, { params }) {
    const org = await getCurrentOrg()
    const orgId = org.id
    const { id } = params

    const requestRes = await query(
        'SELECT * FROM requests WHERE id = $1 AND org_id = $2',
        [id, orgId]
    )

    const evidenceRes = await query(
        `SELECT id, event_type, created_at
     FROM evidence_events
     WHERE request_id = $1
     AND org_id = $2
     ORDER BY created_at ASC`,
        [id, orgId]
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
