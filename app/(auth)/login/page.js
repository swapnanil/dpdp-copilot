'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    if (res.ok) {
      router.push('/')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '80px auto' }}>
      <h3>Login</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {error && (
          <div style={{ color: 'red', fontSize: 14, marginBottom: 8 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: 8,
            background: '#1a73e8',
            color: '#fff',
            border: 'none',
            borderRadius: 4
          }}
        >
          Login
        </button>
      </form>
    </div>
  )
}
