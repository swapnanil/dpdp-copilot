import { NextResponse } from 'next/server'

export async function POST(req) {
  const { username, password } = await req.json()

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('auth', 'true', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    })
    return res
  }

  return new NextResponse('Unauthorized', { status: 401 })
}
