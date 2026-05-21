// ================================
// app/page.js (Inbox UI)
// ================================
// app/page.js (Inbox UI – Phase 1 UX upgrade)

'use client'

import { useEffect, useState } from 'react'

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

export default function Home() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/requests')
            .then(r => r.json())
            .then(data => {
                setRequests(data)
                setLoading(false)
            })
    }, [])


    return (
        <div>
            <h3 style={{ marginTop: 0 }}>DPDP Inbox</h3>

            {loading && (
                <p style={{ color: '#555' }}>
                    Loading DPDP requests…
                </p>
            )}

            {!loading && requests.length === 0 && (
                <p style={{ color: '#555' }}>
                    No DPDP requests yet. When someone submits a grievance or data
                    request, it will appear here.
                </p>
            )}


            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {requests.map(r => {
                    const badge = statusBadge(r)

                    return (
                        <a href={`/requests/${r.id}`}
                            key={r.id}
                            style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div
                                style={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 6,
                                    padding: 12,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start'
                                }}
                            >
                                <div style={{ maxWidth: '75%' }}>
                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                                        {r.type}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                                        {r.status || 'OPEN'}
                                    </div>
                                    <div style={{ fontSize: 14, color: '#444' }}>
                                        {r.message.slice(0, 120)}
                                        {r.message.length > 120 ? '…' : ''}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        background: badge.bg,
                                        color: badge.text,
                                        fontSize: 12,
                                        padding: '4px 8px',
                                        borderRadius: 12,
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {badge.label}
                                </div>
                            </div>
                        </a>
                    )
                })}
            </div>
        </div>
    )
}
