import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const session = getSessionCookie(request)

  if (session && path === '/') return NextResponse.redirect(new URL('/products', request.url))
}
