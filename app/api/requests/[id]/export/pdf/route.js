import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { query } from '../../../../../../lib/db'

export const runtime = 'nodejs'

export async function GET(req, { params }) {
    const { id } = params

    const r = await query('SELECT * FROM requests WHERE id = $1', [id])
    const e = await query(
        'SELECT * FROM evidence_events WHERE request_id = $1 ORDER BY created_at',
        [id]
    )

    if (!r.rows.length) {
        return new Response('Not found', { status: 404 })
    }

    const request = r.rows[0]
    const evidence = e.rows

    const doc = new PDFDocument({
        margin: 50,
        autoFirstPage: false
    })
    const chunks = []

    doc.on('data', c => chunks.push(c))
    doc.on('end', () => { })

    // Register font BEFORE any page exists
    const fontPath = path.join(process.cwd(), 'fonts', 'Inter-Regular.ttf')
    doc.registerFont('Body', fontPath)
    doc.font('Body')

    // Now create the first page
    doc.addPage()


    doc.fontSize(18).text('DPDP Compliance Evidence Report')
    doc.moveDown()

    doc.fontSize(12)
    doc.text(`Request ID: ${request.id}`)
    doc.text(`Type: ${request.type}`)
    doc.text(`Status: ${request.sla_status}`)
    doc.text(`Created At: ${request.created_at}`)
    doc.moveDown()

    doc.text('Original Message:')
    doc.moveDown(0.5)
    doc.text(request.message)
    doc.moveDown()

    if (request.suggested_reply) {
        doc.text('Suggested Reply:')
        doc.moveDown(0.5)
        doc.text(request.suggested_reply)
        doc.moveDown()
    }

    doc.text('Evidence Timeline:')
    doc.moveDown(0.5)

    evidence.forEach(ev => {
        doc.text(
            `${new Date(ev.created_at).toISOString()} — ${ev.event_type}`
        )
    })

    doc.end()

    const pdfBuffer = Buffer.concat(chunks)

    return new Response(pdfBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="dpdp-evidence-${id}.pdf"`
        }
    })
}
