import { NextResponse } from 'next/server'

export async function POST(req) {
  const url = req.nextUrl.clone()
  url.pathname = '/login'

  const res = NextResponse.redirect(url)
  res.cookies.set('auth', '', {
    maxAge: 0,
    path: '/'
  })
  return res
}
