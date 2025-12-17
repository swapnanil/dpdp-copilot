export const runtime = 'nodejs'
import { query } from '../../../../../../lib/db'
import { getCurrentOrg } from '../../../../../../lib/orgService'

export async function GET(req, { params }) {
  const org = await getCurrentOrg()
  const orgId = org.id
  const { id } = params

  const e = await query(
    'SELECT event_type, created_at FROM evidence_events WHERE request_id = $1 AND org_id = $2 ORDER BY created_at',
    [id, orgId]
  )

  let csv = 'event_type,created_at\n'
  e.rows.forEach(row => {
    csv += `${row.event_type},${row.created_at.toISOString()}\n`
  })

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="dpdp-evidence-${id}.csv"`
    }
  })
}
