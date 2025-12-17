import { NextResponse } from 'next/server'

export async function GET(req) {
  const res = NextResponse.redirect(new URL('/login', req.nextUrl.origin))
  res.cookies.set('auth', '', {
    maxAge: 0,
    path: '/'
  })
  return res
}
