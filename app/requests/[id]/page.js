// app/requests/[id]/page.js
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

function slaBadge(status) {
    if (status === 'OVERDUE') {
        return { bg: '#fce8e6', text: '#c5221f', label: 'Overdue' }
    }
    if (status === 'DUE_SOON') {
        return { bg: '#fff4e5', text: '#b06000', label: 'Due soon' }
    }
    return { bg: '#e6f4ea', text: '#137333', label: 'Within SLA' }
}

function statusBadge(request) {
    if (request.status === 'CLOSED') {
        return { bg: '#eeeeee', text: '#555', label: 'Closed' }
    }

    return slaBadge(request.sla_status)
}

export default function RequestDetailPage() {
    const { id } = useParams()
    const [data, setData] = useState(null)
    const [sending, setSending] = useState(false)

    async function sendReply() {
        setSending(true)

        try {
            await fetch(`/api/requests/${id}/send-reply`, {
                method: 'POST'
            })

            const refreshed = await fetch(`/api/requests/${id}`)
            const refreshedData = await refreshed.json()
            setData(refreshedData)
        } finally {
            setSending(false)
        }
    }

    useEffect(() => {
        fetch(`/api/requests/${id}`)
            .then(r => r.json())
            .then(setData)
    }, [id])

    if (!data) {
        return <p>Loading request…</p>
    }

    if (data.error) {
        return <p>{data.error}</p>
    }

    const { request, evidence } = data
    const status = statusBadge(request)
    const sent = evidence.some(e => e.event_type === 'REPLY_SENT')

    return (
        <div>
            <h3 style={{ marginTop: 0 }}>
                {request.type} Request
            </h3>

            <div
                style={{
                    marginBottom: 16,
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: status.bg,
                    color: status.text,
                    fontSize: 14,
                    display: 'inline-block'
                }}
            >
                Status: {status.label}
            </div>


            {/* Facts */}
            <div style={{ marginBottom: 16, fontSize: 14, color: '#444' }}>
                <div><b>Request ID:</b> {request.id}</div>
                <div><b>Workflow Status:</b> {request.status || 'OPEN'}</div>
                <div><b>SLA Status:</b> {request.sla_status}</div>
                <div><b>Created:</b> {new Date(request.created_at).toLocaleString()}</div>
            </div>

            {/* Checklist */}
            <div style={{ marginBottom: 24 }}>
                <h4>Resolution Checklist</h4>
                <ul>
                    <li>Done: Request received</li>
                    <li>Done: Request classified</li>
                    <li>{request.suggested_reply ? 'Done' : 'Pending'}: Reply drafted</li>
                    <li>{sent ? 'Done' : 'Pending'}: Response sent</li>
                </ul>
            </div>

            {/* Reply */}
            <div style={{ marginBottom: 24 }}>
                <h4>Suggested Reply</h4>

                <div
                    style={{
                        background: '#f7f7f7',
                        padding: 12,
                        borderRadius: 6,
                        fontSize: 14,
                        marginBottom: 12
                    }}
                >
                    {request.suggested_reply || 'No reply drafted yet.'}
                </div>

                <button
                    onClick={sendReply}
                    disabled={sending || sent}
                    style={{
                        padding: '8px 16px',
                        borderRadius: 6,
                        border: 'none',
                        background: sent ? '#e0e0e0' : '#1a73e8',
                        color: sent ? '#555' : '#fff',
                        cursor: sent ? 'default' : 'pointer'
                    }}
                >
                    {sent ? 'Reply sent' : sending ? 'Sending…' : 'Send reply'}
                </button>
            </div>

            {/* Original message */}
            <div style={{ marginBottom: 24 }}>
                <h4>Original Message</h4>
                <div
                    style={{
                        background: '#f7f7f7',
                        padding: 12,
                        borderRadius: 6,
                        fontSize: 14
                    }}
                >
                    {request.message}
                </div>
            </div>

            {/* Evidence log */}
            <div>
                <h4>Evidence Log</h4>
                <div style={{ fontSize: 14 }}>
                    {evidence.map(ev => (
                        <div key={ev.id} style={{ marginBottom: 6 }}>
                            {new Date(ev.created_at).toLocaleString()} — {ev.event_type}
                        </div>
                    ))}
                </div>
            </div>

            {/* Export Evidence*/}
            <div style={{ marginTop: 24 }}>
                <h4>Export Evidence</h4>

                <div style={{ display: 'flex', gap: 12 }}>
                    <a
                        href={`/api/requests/${request.id}/export/pdf`}
                        target="_blank"
                    >
                        Export PDF
                    </a>

                    <a
                        href={`/api/requests/${request.id}/export/csv`}
                        target="_blank"
                    >
                        Export CSV
                    </a>
                </div>
            </div>
            
        </div>
    )
}
