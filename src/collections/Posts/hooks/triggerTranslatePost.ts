import { Post } from '@/payload-types'
import { CollectionAfterChangeHook } from 'payload'
import { translatePostTask } from '@/tasks/translator'

export const triggerTranslatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  req,
  operation,
}) => {
  // Only trigger task for published posts in English
  // Skip if not published or if locale is explicitly set to non-English
  if (doc._status !== 'published' || (req.locale && req.locale !== 'en')) {
    return doc
  }
  if (operation !== 'create' && operation !== 'update') {
    return doc
  }

  try {
    console.log(`Starting immediate translation for post: ${doc.slug}`)

    // Execute translation task immediately instead of queuing
    const result = await translatePostTask({
      input: { postId: doc.id },
      req,
    })

    if (result.output.success) {
      console.log(`Successfully translated post: ${doc.slug}`)
    } else {
      console.error(`Translation failed for post ${doc.slug}: ${result.output.message}`)
    }
  } catch (error) {
    console.error(`Error translating post ${doc.slug}:`, error)
  }

  return doc
}
