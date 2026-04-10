import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect staff routes (except login)
  if (pathname.startsWith('/staff') && !pathname.startsWith('/staff/login')) {
    const token = request.cookies.get('afrikatoday_token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/staff/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/staff/:path*'],
}
