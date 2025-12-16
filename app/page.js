// ================================
// app/page.js (Inbox UI)
// ================================
'use client'
{
    requests.length === 0 && (
        <p style={{ color: '#555' }}>
            No DPDP requests yet. When someone submits a grievance or data request,
            it will appear here.
        </p>
    )
}


<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {requests.map(r => {
        const badge = slaBadge(r.sla_status)
        return (
            <div
                key={r.id}
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
                    <div style={{ fontSize: 14, color: '#444' }}>
                        {r.message.slice(0, 120)}{r.message.length > 120 ? '…' : ''}
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
        )
    })}
</div>
</div >
)
}
<ul>
    {requests.map(r => (
        <li key={r.id}>
            <b>{r.type}</b> – {r.message} (SLA: {r.sla_status})
        </li>
    ))}
</ul>
</div >
)
}