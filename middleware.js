import { NextResponse } from 'next/server'
import { isValidSession } from './lib/auth'

export async function middleware(req) {
  const { pathname } = req.nextUrl
  const auth = req.cookies.get('auth')?.value
  const authenticated = await isValidSession(auth)

  if (pathname === '/login' && authenticated) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/api/logout') ||
    pathname.startsWith('/api/public') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  if (!authenticated) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}
