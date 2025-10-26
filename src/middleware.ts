import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match only internationalized pathnames
  // Exclude API routes, static files, Payload admin, and OAuth routes
  matcher: ['/((?!api|_next|_vercel|admin|oauth|.*\\..*).*)', '/'],
}
