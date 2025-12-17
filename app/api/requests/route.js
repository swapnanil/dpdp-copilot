// ================================
// app/api/requests/route.js
// ================================
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { query } from '../../../lib/db'
import { classifyRequest, draftReply } from '../../../lib/llm'
import { computeSlaStatus } from '../../../lib/sla'
import { v4 as uuid } from 'uuid'
import { logEvidence } from '../../../lib/evidence'
import { getCurrentOrg } from '../../../../../../lib/orgService'
const SLA_DAYS = 7


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
    const org = await getCurrentOrg()
    const orgId = org.id
    const body = await req.json()
    const { message, language } = body

    const id = uuid()

    // 1️⃣ Store request
    const slaDueAt = new Date()
    slaDueAt.setDate(slaDueAt.getDate() + SLA_DAYS)

    await query(
        `INSERT INTO requests (id, message, type, sla_status, sla_due_at, org_id)
   VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, message, 'PENDING', 'OPEN', slaDueAt, orgId]
    )


    await logEvidence(id, 'REQUEST_CREATED', {
        source: 'public_form'
    })

    // 2️⃣ Classify
    const type = await classifyRequest(message)

    await query(
        `UPDATE requests SET type = $1 WHERE id = $2 AND org_id = $3`,
        [type, id, orgId]
    )

    await logEvidence(id, 'REQUEST_CLASSIFIED', {
        type
    })

    // 3️⃣ Draft reply
    const reply = await draftReply(message, type, language)

    await query(
        `UPDATE requests SET suggested_reply = $1 WHERE id = $2 AND org_id = $3`,
        [reply, id, orgId]
    )

    await logEvidence(id, 'REPLY_SUGGESTED', {
        language
    })

    return Response.json({ id, type, reply })
}
