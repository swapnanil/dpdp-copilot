// app/requests/[id]/page.js
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function RequestDetailPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(`/api/requests/${id}`)
      .then(r => r.json())
      .then(setData)
  }, [id])

  if (!data) {
    return <p>Loading request…</p>
  }

  const { request, evidence } = data

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>
        {request.type} Request
      </h3>

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
          <li>⬜ Response sent</li>
        </ul>
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
