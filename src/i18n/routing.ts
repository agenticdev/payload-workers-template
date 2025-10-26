import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
import { nextIntlLocales, defaultLocale } from '@/utilities/locales'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: nextIntlLocales,

  // Used when no locale matches
  defaultLocale: defaultLocale,

  // The prefix used for the default locale
  localePrefix: {
    mode: 'as-needed',
    prefixes: {
      // English will be at / instead of /en
      [defaultLocale]: '',
    },
  },
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
