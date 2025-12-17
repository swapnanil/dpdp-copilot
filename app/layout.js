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
            {/* Left: Product */}
            <div>
                <h2 style={{ margin: 0 }}>DPDP Copilot</h2>

                <div
                    style={{
                        marginTop: 8,
                        padding: '8px 12px',
                        borderRadius: 6,
                        background: '#e6f4ea',
                        color: '#137333',
                        fontSize: 14,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8
                    }}
                >
                    <span style={{ fontSize: 12 }}>🟢</span>
                    DPDP Status: All requests are within SLA
                </div>
            </div>

            {/* Right: Org + actions */}
            <div style={{ textAlign: 'right' }}>
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 12px',
                        borderRadius: 20,
                        background: '#eef3ff',
                        color: '#1a3d8f',
                        fontWeight: 600,
                        fontSize: 14
                    }}
                    title="Active Organization"
                >
                    🏢 {org.name}
                </div>

                <div style={{ marginTop: 6 }}>
                    <LogoutButton />
                </div>
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
