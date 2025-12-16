// app/requests/[id]/page.js
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

function slaBadge(status) {
    if (status === 'OVERDUE') {
        return { bg: '#fce8e6', text: '#c5221f', label: 'Overdue', icon: '🔴' }
    }
    if (status === 'DUE_SOON') {
        return { bg: '#fff4e5', text: '#b06000', label: 'Due soon', icon: '🟠' }
    }
    return { bg: '#e6f4ea', text: '#137333', label: 'Within SLA', icon: '🟢' }
}

export default function RequestDetailPage() {
    const { id } = useParams()
    const [data, setData] = useState(null)
    const [sending, setSending] = useState(false)

    async function sendReply() {
        setSending(true)

        await fetch(`/api/requests/${request.id}/send-reply`, {
            method: 'POST'
        })

        // Re-fetch request + evidence
        const refreshed = await fetch(`/api/requests/${request.id}`)
        const data = await refreshed.json()
        setData(data)
        setSending(false)
    }

    useEffect(() => {
        fetch(`/api/requests/${id}`)
            .then(r => r.json())
            .then(setData)
    }, [id])

    if (!data) {
        return <p>Loading request…</p>
    }

    const { request, evidence } = data
    const sla = slaBadge(request.sla_status)
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
                    background: sla.bg,
                    color: sla.text,
                    fontSize: 14,
                    display: 'inline-block'
                }}
            >
                {sla.icon} SLA Status: {sla.label}
            </div>


            {/* Facts */}
            <div style={{ marginBottom: 16, fontSize: 14, color: '#444' }}>
                <div><b>Request ID:</b> {request.id}</div>
                <div><b>Created:</b> {new Date(request.created_at).toLocaleString()}</div>
            </div>

            {/* Checklist */}
            <div style={{ marginBottom: 24 }}>
                <h4>Resolution Checklist</h4>
                <ul>
                    <li>✔ Request received</li>
                    <li>✔ Request classified</li>
                    <li>{request.suggested_reply ? '✔' : '⬜'} Reply drafted</li>
                    <li>{sent ? '✔' : '⬜'} Response sent</li>
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
        </div>
    )
}
