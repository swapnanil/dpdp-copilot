// ================================
// app/layout.js
// ================================
// app/layout.js (Phase 1 UX upgrade)
export const dynamic = 'force-dynamic'
import LogoutButton from './components/LogoutButton'
import { getCurrentOrg } from './../lib/orgService'

export default async function RootLayout({ children }) {
  const org = await getCurrentOrg()
  return (
    <html>
      <body
        style={{
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI',
          margin: 0,
          background: '#f7f7f7'
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            padding: '24px 16px'
          }}
        >
          {/* Header */}
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 16
            }}
        >
            {/* Left: Product + Status */}
            <div>
                <h2 style={{ margin: 0 }}>DPDP Copilot</h2>

                <div
                    style={{
                        marginTop: 8,
                        padding: '8px 12px',
                        borderRadius: 6,
                        background: '#e6f4ea',
                        color: '#137333',
                        fontSize: 14
                    }}
                >
                    🟢 DPDP Status: All requests are within SLA
                </div>
            </div>

            {/* Right: Org name + Logout */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 8
                }}
            >
                <div
                    style={{
                        fontSize: 13,
                        color: '#374151',
                        background: '#f3f4f6',
                        padding: '4px 10px',
                        borderRadius: 12,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {org.name}
                </div>

                <LogoutButton />
            </div>
        </div>

          {/* Page content */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 8,
              padding: 16,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
