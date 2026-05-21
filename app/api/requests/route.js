// ================================
// app/api/requests/route.js
// ================================
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { query } from '../../../lib/db'
import { computeSlaStatus } from '../../../lib/sla'
import { getCurrentOrg } from '../../../lib/orgService'
import { createDpdpRequest } from '../../../lib/requestService'
import { parseRequestBody } from '../../../lib/validation'


export async function GET() {
    const org = await getCurrentOrg()
    const orgId = org.id
    const res = await query('SELECT * FROM requests WHERE org_id = $1 ORDER BY created_at DESC', [orgId])
    const rows = res.rows.map(r => ({
        ...r,
        sla_status: computeSlaStatus(r.sla_due_at)
    }))

    return Response.json(rows)
}


export async function POST(req) {
    let body

    try {
        body = await req.json()
    } catch {
        return Response.json({ error: 'invalid JSON body' }, { status: 400 })
    }

    const parsed = parseRequestBody(body)
    if (!parsed.ok) {
        return Response.json({ error: parsed.error }, { status: 400 })
    }

    const result = await createDpdpRequest({
        ...parsed.value,
        source: 'operator'
    })

    return Response.json(result, { status: 201 })
}
