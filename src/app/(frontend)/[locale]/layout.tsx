import React from 'react'
import { draftMode } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

import { AdminBar } from '@/components/AdminBar'
import { Providers } from '@/providers'
import { LocaleHtmlLang } from '@/components/LocaleHtmlLang'
import { Navbar5 } from '@/components/Layout/Navbar5'
import { Footer7 } from '@/components/Layout/Footer7'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Enable static rendering
  setRequestLocale(locale)

  const { isEnabled } = await draftMode()

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtmlLang locale={locale} />
      <Providers>
        <AdminBar
          adminBarProps={{
            preview: isEnabled,
          }}
        />
        <Navbar5 />
        {children}
        <Footer7 />
      </Providers>
    </NextIntlClientProvider>
  )
}
