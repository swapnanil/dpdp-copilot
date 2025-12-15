// ================================
// app/layout.js
// ================================
export default function RootLayout({ children }) {
    return (
        <html>
            <body style={{ fontFamily: 'system-ui', margin: 0, padding: 20 }}>
                <h2>DPDP Copilot</h2>
                {children}
            </body>
        </html>
    )
}