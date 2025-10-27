import { Post } from "@/payload-types"
import { CollectionAfterChangeHook } from "payload"

export const triggerTranslatePost: CollectionAfterChangeHook<Post> = async ({
    doc,
    req,
    operation,
}) => {
    // Only trigger task for published posts in English
    if (doc._status !== 'published' || (req.locale && req.locale !== 'en')) {
        return doc
    }
    if (operation !== 'create' && operation !== 'update') {
        return doc
    }
    try {
        const waitUntil = new Date(Date.now() + 10 * 1000) // 10 seconds
        await req.payload.jobs.queue({
            task: 'translatePost',
            input: {
                postId: doc.id,
            },
            waitUntil,
            queue: 'default',
        })
        console.log(`Queued translatePost task for post: ${doc.slug} to execute at: ${waitUntil.toISOString()}`)
    } catch (error) {
        console.error(`Error queuing translatePost task for post ${doc.slug}:`, error)
    }
    return doc
}