export const runtime = 'nodejs'
import puppeteer from 'puppeteer'
import { query } from '../../../../../../lib/db'
import { renderEvidenceHtml } from '../../../../../../lib/pdfTemplates/evidenceReport'
import { getCurrentOrgId } from '../../../../../../lib/orgContext'
import { getCurrentOrg } from '../../../../../../lib/orgService'

export async function GET(req, { params }) {
  const orgId = getCurrentOrgId()
  const org = await getCurrentOrg()
  const { id } = params

  const r = await query('SELECT * FROM requests WHERE id = $1 AND org_id = $2', [id, orgId])
  const e = await query(
    'SELECT * FROM evidence_events WHERE request_id = $1 AND org_id = $2 ORDER BY created_at',
    [id, orgId]
  )

  if (!r.rows.length) {
    return new Response('Not found', { status: 404 })
  }

  const html = renderEvidenceHtml({
    org,
    request: r.rows[0],
    evidence: e.rows
  })

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  })

  await browser.close()

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="dpdp-evidence-${id}.pdf"`
    }
  })
}
