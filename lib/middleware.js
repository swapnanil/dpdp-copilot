import { NextResponse } from 'next/server'

export function middleware(req) {
  const { pathname } = req.nextUrl

  // Public routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  const auth = req.cookies.get('auth')
  if (!auth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}
