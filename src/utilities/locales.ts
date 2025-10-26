// Shared locale configuration between next-intl and Payload CMS
export const locales = [
  {
    code: 'en',
    label: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'bg',
    label: 'Български',
    flag: '🇧🇬',
  },
  {
    code: 'tr',
    label: 'Türkçe',
    flag: '🇹🇷',
  },
] as const

export const defaultLocale = 'en'

export type Locale = (typeof locales)[number]['code']

// For next-intl
export const nextIntlLocales = locales.map((locale) => locale.code)

// For Payload CMS
export const payloadLocales = locales.map((locale) => ({
  label: locale.label,
  code: locale.code,
}))
