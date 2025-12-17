import { NextResponse } from 'next/server'

export function middleware(req) {
  const { pathname } = req.nextUrl
  const auth = req.cookies.get('auth')?.value

  // Public routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/api/logout') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  // Logged-in user trying to access /login → redirect home
  if (pathname === '/login' && auth === 'true') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Not logged in → protect everything else
  if (auth !== 'true' && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}
