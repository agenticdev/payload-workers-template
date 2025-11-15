'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { locales } from '@/utilities/locales'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations()

  const currentLocale = locales.find((l) => l.code === locale)

  const handleLocaleChange = (newLocale: string) => {
    // Get the current pathname segments
    const segments = pathname.split('/').filter(Boolean)

    // Map of slug translations between locales
    const slugMap: Record<string, Record<string, string>> = {
      // English to other languages
      about: {
        bg: t('slugs.about', { locale: 'bg' }),
        tr: t('slugs.about', { locale: 'tr' }),
        en: 'about',
      },
      contact: {
        bg: t('slugs.contact', { locale: 'bg' }),
        tr: t('slugs.contact', { locale: 'tr' }),
        en: 'contact',
      },
      posts: {
        bg: t('slugs.posts', { locale: 'bg' }),
        tr: t('slugs.posts', { locale: 'tr' }),
        en: 'posts',
      },
      pages: {
        bg: t('slugs.pages', { locale: 'bg' }),
        tr: t('slugs.pages', { locale: 'tr' }),
        en: 'pages',
      },
      // Bulgarian to other languages
      'za-nas': {
        en: 'about',
        tr: t('slugs.about', { locale: 'tr' }),
        bg: 'za-nas',
      },
      kontakt: {
        en: 'contact',
        tr: t('slugs.contact', { locale: 'tr' }),
        bg: 'kontakt',
      },
      publikatsii: {
        en: 'posts',
        tr: t('slugs.posts', { locale: 'tr' }),
        bg: 'publikatsii',
      },
      stranitsi: {
        en: 'pages',
        tr: t('slugs.pages', { locale: 'tr' }),
        bg: 'stranitsi',
      },
      // Turkish to other languages
      hakkinda: {
        en: 'about',
        bg: t('slugs.about', { locale: 'bg' }),
        tr: 'hakkinda',
      },
      iletisim: {
        en: 'contact',
        bg: t('slugs.contact', { locale: 'bg' }),
        tr: 'iletisim',
      },
      gonderiler: {
        en: 'posts',
        bg: t('slugs.posts', { locale: 'bg' }),
        tr: 'gonderiler',
      },
      sayfalar: {
        en: 'pages',
        bg: t('slugs.pages', { locale: 'bg' }),
        tr: 'sayfalar',
      },
    }

    // Translate each segment to the new locale
    const translatedSegments = segments.map((segment) => {
      if (slugMap[segment] && slugMap[segment][newLocale]) {
        return slugMap[segment][newLocale]
      }
      return segment
    })

    const newPath = translatedSegments.length > 0 ? `/${translatedSegments.join('/')}` : '/'

    router.push(newPath, { locale: newLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={t('languageSwitcher.label')}>
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc.code}
            onClick={() => handleLocaleChange(loc.code)}
            className={locale === loc.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{loc.flag}</span>
            {loc.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
