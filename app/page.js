// ================================
// app/page.js (Inbox UI)
// ================================
'use client'
import { useEffect, useState } from 'react'


export default function Home() {
    const [requests, setRequests] = useState([])


    useEffect(() => {
        fetch('/api/requests').then(r => r.json()).then(setRequests)
    }, [])


    return (
        <div>
            <h3>DPDP Inbox</h3>
            {requests.length === 0 && <p>No DPDP requests yet.</p>}
            <ul>
                {requests.map(r => (
                    <li key={r.id}>
                        <b>{r.type}</b> – {r.message} (SLA: {r.sla_status})
                    </li>
                ))}
            </ul>
        </div>
    )
}