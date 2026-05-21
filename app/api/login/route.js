import { NextResponse } from 'next/server'
import { createSessionValue, SESSION_MAX_AGE_SECONDS } from '../../../lib/auth'

export async function POST(req) {
  let body

  try {
    body = await req.json()
  } catch {
    return new NextResponse('Invalid JSON body', { status: 400 })
  }

  const { username, password } = body

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('auth', await createSessionValue(), {
      httpOnly: true,
      maxAge: SESSION_MAX_AGE_SECONDS,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    })
    return res
  }

  return new NextResponse('Unauthorized', { status: 401 })
}
