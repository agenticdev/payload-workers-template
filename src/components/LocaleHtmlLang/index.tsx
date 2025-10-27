'use client'

import { useEffect } from 'react'

export function LocaleHtmlLang({ locale }: { locale: string }): null {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}
