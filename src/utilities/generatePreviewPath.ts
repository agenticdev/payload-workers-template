import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, req }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  // Get locale from request (Payload provides this)
  const locale = req.locale || 'en'

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  // Build locale-prefixed path
  const basePath = collectionPrefixMap[collection]
  const localePath = locale === 'en' ? '' : `/${locale}`
  const fullPath = slug === 'home'
    ? localePath || '/'
    : `${localePath}${basePath}/${encodedSlug}`

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    locale,
    path: fullPath,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
