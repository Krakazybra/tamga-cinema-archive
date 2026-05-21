import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { auth } from '@/auth'
import { routing } from '@/i18n/routing'

const intlMiddleware = createMiddleware(routing)
const protectedPaths = ['/profile']

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const pathWithoutLocale = pathname.replace(/^\/(kk|ru|en)/, '')
  const isProtected = protectedPaths.some((p) => pathWithoutLocale.startsWith(p))

  if (isProtected) {
    const session = await auth()
    if (!session) {
      const locale = pathname.split('/')[1] || 'ru'
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url))
    }
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
