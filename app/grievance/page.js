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

    await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `[Contact: ${contact}]\n${message}`,
        language
      })
    })

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div>
        <h3>Request submitted</h3>
        <p>
          Your request has been received and will be reviewed.
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <h3>Personal Data Request / Grievance</h3>

      <p style={{ color: '#555' }}>
        Use this form to request access, correction, or deletion of your personal data,
        or to raise a grievance related to personal data.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Contact (email or phone)</label><br />
          <input
            required
            value={contact}
            onChange={e => setContact(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Message</label><br />
          <textarea
            required
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Preferred language</label><br />
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Bengali</option>
            <option>Tamil</option>
            <option>Marathi</option>
          </select>
        </div>

        <button disabled={loading}>
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
