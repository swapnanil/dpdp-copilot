// ================================
// app/api/requests/route.js
// ================================
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { query } from '../../../lib/db'
import { classifyRequest, draftReply } from '../../../lib/llm'
import { v4 as uuid } from 'uuid'


export async function GET() {
    const res = await query('SELECT * FROM requests ORDER BY created_at DESC')
    return Response.json(res.rows)
}


export async function POST(req) {
    const body = await req.json()
    const { message, language } = body
    const source = body.source || 'unknown'

    const type = await classifyRequest(message)
    const reply = await draftReply(message, type, language)


    const id = uuid()
    await query(
        'INSERT INTO requests (id, message, type, suggested_reply, sla_status) VALUES ($1,$2,$3,$4,$5)',
        [id, message, type, reply, 'OPEN']
    )


    return Response.json({ id, type, reply })
}