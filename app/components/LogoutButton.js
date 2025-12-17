'use client'

import { usePathname } from 'next/navigation'

export default function LogoutButton() {
  const pathname = usePathname()

  // Do not show logout on login page
  if (pathname === '/login') return null

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
