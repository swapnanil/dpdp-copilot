'use client'

export default function LogoutButton() {
  async function logout() {
    await fetch('/api/logout')
    window.location.href = '/login'
  }

  return (
    <button
      onClick={logout}
      style={{
        background: 'none',
        border: 'none',
        color: '#1a73e8',
        cursor: 'pointer',
        padding: 0,
        fontSize: 14
      }}
    >
      Logout
    </button>
  )
}
