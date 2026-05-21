// app/grievance/page.js
'use client'

import { useState } from 'react'

export default function GrievancePage() {
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [language, setLanguage] = useState('English')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    await fetch('/api/public/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `[Contact: ${contact}]\n${message}`,
        language,
        source: 'public_form'
      })
    })

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto' }}>
        <h3>Request submitted</h3>
        <p style={{ color: '#444' }}>
          Your request has been received and logged.
          It will be reviewed and processed as per India’s DPDP Act.
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '40px auto',
        background: '#ffffff',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        Personal Data Request / Grievance
      </h3>

      <p style={{ color: '#555', fontSize: 14 }}>
        Use this form to request access, correction, or deletion of your
        personal data, or to raise a grievance related to personal data.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600 }}>
            Contact (email or phone)
          </label>
          <input
            required
            value={contact}
            onChange={e => setContact(e.target.value)}
            style={{
              width: '100%',
              marginTop: 6,
              padding: 8,
              borderRadius: 4,
              border: '1px solid #ccc'
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600 }}>
            Message
          </label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={{
              width: '100%',
              marginTop: 6,
              padding: 8,
              borderRadius: 4,
              border: '1px solid #ccc'
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontWeight: 600 }}>
            Preferred language
          </label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{
              width: '100%',
              marginTop: 6,
              padding: 8,
              borderRadius: 4
            }}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Bengali</option>
            <option>Tamil</option>
            <option>Marathi</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 6,
            border: 'none',
            background: '#1a73e8',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {loading ? 'Submitting…' : 'Submit request'}
        </button>
      </form>

      <div
        style={{
          marginTop: 16,
          fontSize: 12,
          color: '#777'
        }}
      >
        This request will be logged and processed as per India’s DPDP Act.
      </div>
    </div>
  )
}
