// ================================
// app/layout.js
// ================================
export default function RootLayout({ children }) {
    return (
        <html>
            <body style={{
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI',
                margin: 0,
                background: '#f7f7f7'
            }}>
                <div style={{
                    maxWidth: 960,
                    margin: '0 auto',
                    padding: '24px 16px'
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: 16 }}>
                        <h2 style={{ margin: 0 }}>DPDP Copilot</h2>
                        <div style={{
                            marginTop: 8,
                            padding: '8px 12px',
                            borderRadius: 6,
                            background: '#e6f4ea',
                            color: '#137333',
                            fontSize: 14
                        }}>
                            🟢 DPDP Status: All requests are within SLA
                        </div>
                    </div>


                    {/* Page content */}
                    <div style={{
                        background: '#fff',
                        borderRadius: 8,
                        padding: 16,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        {children}
                    </div>
                </div>
            </body>
        </html>
    )
}
</body >
</html >
)
}