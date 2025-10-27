import type { PayloadRequest } from 'payload'
import type { Media, Page, Post, Dictionary, User, PartOfSpeech, Category } from '@/payload-types'
import { SUPPORTED_LOCALES } from '@/constants'
import OpenAI from 'openai'

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Task interfaces for existing collections
export interface TranslatePostTaskInput {
  postId: number
}

export interface TranslatePostTaskOutput {
  success: boolean
  message: string
}

export interface TranslateMediaTaskInput {
  mediaId: number
}

export interface TranslateMediaTaskOutput {
  success: boolean
  message: string
}

export interface TranslatePageTaskInput {
  pageId: number
}

export interface TranslatePageTaskOutput {
  success: boolean
  message: string
}

export interface TranslateCategoryTaskInput {
  categoryId: number
}

export interface TranslateCategoryTaskOutput {
  success: boolean
  message: string
}

export interface TranslateUserTaskInput {
  userId: number
}

export interface TranslateUserTaskOutput {
  success: boolean
  message: string
}

export interface TranslatePartOfSpeechTaskInput {
  partOfSpeechId: number
}

export interface TranslatePartOfSpeechTaskOutput {
  success: boolean
  message: string
}

export interface TranslateWordTaskInput {
  dictionaryId: number
}

export interface TranslateWordTaskOutput {
  success: boolean
  message: string
}

// Define LexicalNode type for rich text nodes
interface LexicalNode {
  type?: string
  children?: LexicalNode[]
  text?: string
  tag?: string
  format?: '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify'
  url?: string
  src?: string
  alt?: string
  caption?: string
  code?: string
  language?: string
  fields?: {
    blockType?: string
    content?: string
    language?: string
    code?: string
    alt?: string
    url?: string
    caption?: string
  }
  [key: string]: unknown
}

async function translateText({ text, targetLang }: { text: string; targetLang: string }) {
  const translationPrompt = `Translate the following text to ${targetLang} (preserve any markdown formatting, HTML tags, or special characters):\n\n${text}`
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: translationPrompt }],
    max_tokens: 2048,
  })
  return response.choices?.[0]?.message?.content?.trim() ?? ''
}

async function translateLexicalNode(node: LexicalNode, targetLang: string): Promise<LexicalNode> {
  // Clone the node to avoid modifying the original
  const translatedNode: LexicalNode = { ...node }

  // If the node has text content, translate it
  if (node.text) {
    translatedNode.text = await translateText({ text: node.text, targetLang })
  }

  // If the node has children, translate each child
  if (Array.isArray(node.children)) {
    translatedNode.children = await Promise.all(
      node.children.map((child: LexicalNode) => translateLexicalNode(child, targetLang)),
    )
  }

  // Handle special blocks (like banner, code, etc.)
  if (node.fields) {
    const translatedFields = { ...node.fields }
    if (translatedFields.content) {
      translatedFields.content = await translateText({ text: translatedFields.content, targetLang })
    }
    if (translatedFields.caption) {
      translatedFields.caption = await translateText({ text: translatedFields.caption, targetLang })
    }
    translatedNode.fields = translatedFields
  }

  return translatedNode
}

export const translatePostTask = async ({
  input,
  req,
}: {
  input: TranslatePostTaskInput
  req: PayloadRequest
}): Promise<{ output: TranslatePostTaskOutput }> => {
  try {
    const post = await req.payload.findByID({
      collection: 'posts',
      id: input.postId,
      depth: 1,
      locale: 'en',
    })

    if (!post || post._status !== 'published') {
      return { output: { success: false, message: 'Post not found or not published' } }
    }

    // Translate title and content to all supported locales
    for (const locale of SUPPORTED_LOCALES) {
      if (locale === 'en') continue
      try {
        const translatedTitle = await translateText({
          text: post.title as string,
          targetLang: locale,
        })

        const translatedContent = post.content
          ? {
              ...post.content,
              root: await translateLexicalNode(post.content.root, locale),
            }
          : undefined

        const translatedMeta = post.meta ? { ...post.meta } : undefined
        if (translatedMeta) {
          if (translatedMeta.title) {
            translatedMeta.title = await translateText({
              text: translatedMeta.title as string,
              targetLang: locale,
            })
          }
          if (translatedMeta.description) {
            translatedMeta.description = await translateText({
              text: translatedMeta.description as string,
              targetLang: locale,
            })
          }
        }

        await req.payload.update({
          collection: 'posts',
          id: input.postId,
          data: {
            title: translatedTitle,
            ...(translatedContent ? { content: translatedContent } : {}),
            ...(translatedMeta ? { meta: translatedMeta } : {}),
          },
          locale: locale as SupportedLocale,
          draft: true,
          context: { disableRevalidate: true },
        })

        console.log(`Created draft translation for locale ${locale} of post: ${post.slug}`)
      } catch (error) {
        console.error(`Error translating to ${locale}:`, error)
      }
    }
    return {
      output: { success: true, message: 'Created draft translations in all supported locales' },
    }
  } catch (error) {
    console.error('Translation task error:', error)
    return {
      output: {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}

export const translateMediaTask = async ({
  input,
  req,
}: {
  input: TranslateMediaTaskInput
  req: PayloadRequest
}): Promise<{ output: TranslateMediaTaskOutput }> => {
  try {
    const media = (await req.payload.findByID({
      collection: 'media',
      id: input.mediaId,
      depth: 0,
      locale: 'en',
    })) as Media

    if (!media) {
      return { output: { success: false, message: 'Media not found' } }
    }

    const sourceAlt: string | undefined = media?.alt || undefined
    const sourceCaption = media?.caption

    for (const locale of SUPPORTED_LOCALES) {
      if (locale === 'en') continue
      try {
        const updateData: Partial<Media> = {}

        if (typeof sourceAlt === 'string' && sourceAlt.trim().length > 0) {
          updateData.alt = await translateText({ text: sourceAlt, targetLang: locale })
        }

        if (sourceCaption && typeof sourceCaption === 'object' && sourceCaption !== null) {
          try {
            const rootNode = (sourceCaption as Record<string, unknown>).root
            if (rootNode && typeof rootNode === 'object') {
              updateData.caption = {
                ...sourceCaption,
                root: await translateLexicalNode(rootNode as LexicalNode, locale),
              } as Media['caption']
            }
          } catch (e) {
            console.warn('translateMediaTask: caption translation skipped due to structure', e)
          }
        }

        if (Object.keys(updateData).length > 0) {
          await req.payload.update({
            collection: 'media',
            id: input.mediaId,
            data: updateData,
            locale: locale as SupportedLocale,
            draft: true,
            context: { disableRevalidate: true },
          })
          console.log(`Created draft media translation for locale ${locale} id: ${media.id}`)
        }
      } catch (error) {
        console.error(`Error translating media to ${locale}:`, error)
      }
    }
    return {
      output: {
        success: true,
        message: 'Created draft translations for media in all supported locales',
      },
    }
  } catch (error) {
    console.error('translateMediaTask error:', error)
    return {
      output: {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}

export const translatePageTask = async ({
  input,
  req,
}: {
  input: TranslatePageTaskInput
  req: PayloadRequest
}): Promise<{ output: TranslatePageTaskOutput }> => {
  try {
    const page = (await req.payload.findByID({
      collection: 'pages',
      id: input.pageId,
      depth: 1,
      locale: 'en',
    })) as Page

    if (!page || page._status !== 'published') {
      return { output: { success: false, message: 'Page not found or not published' } }
    }

    for (const locale of SUPPORTED_LOCALES) {
      if (locale === 'en') continue
      try {
        const updatedData: Record<string, unknown> = {}

        if (typeof page.title === 'string' && page.title.length > 0) {
          updatedData.title = await translateText({ text: page.title, targetLang: locale })
        }

        await req.payload.update({
          collection: 'pages',
          id: input.pageId,
          data: updatedData,
          locale: locale as SupportedLocale,
          draft: true,
          context: { disableRevalidate: true },
        })
        console.log(`Created draft translation for locale ${locale} of page: ${page.slug}`)
      } catch (error) {
        console.error(`Error translating page to ${locale}:`, error)
      }
    }

    return {
      output: {
        success: true,
        message: 'Created draft translations in all supported locales for page',
      },
    }
  } catch (error) {
    console.error('translatePageTask error:', error)
    return {
      output: {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}

export const translateCategoryTask = async ({
  input,
  req,
}: {
  input: TranslateCategoryTaskInput
  req: PayloadRequest
}): Promise<{ output: TranslateCategoryTaskOutput }> => {
  try {
    const category = (await req.payload.findByID({
      collection: 'categories',
      id: input.categoryId,
      depth: 1,
      locale: 'en',
    })) as Category

    if (!category) {
      return { output: { success: false, message: 'Category not found' } }
    }

    for (const locale of SUPPORTED_LOCALES) {
      if (locale === 'en') continue
      try {
        const updatedData: Record<string, unknown> = {}

        if (typeof category.title === 'string' && category.title.length > 0) {
          updatedData.title = await translateText({ text: category.title, targetLang: locale })
        }

        if (Object.keys(updatedData).length > 0) {
          await req.payload.update({
            collection: 'categories',
            id: input.categoryId,
            data: updatedData,
            locale: locale as SupportedLocale,
            context: { disableRevalidate: true },
          })
          console.log(`Created translation for locale ${locale} of category: ${category.title}`)
        }
      } catch (error) {
        console.error(`Error translating category to ${locale}:`, error)
      }
    }

    return {
      output: {
        success: true,
        message: 'Created translations in all supported locales for category',
      },
    }
  } catch (error) {
    console.error('translateCategoryTask error:', error)
    return {
      output: {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}

export const translateUserTask = async ({
  input,
  req,
}: {
  input: TranslateUserTaskInput
  req: PayloadRequest
}): Promise<{ output: TranslateUserTaskOutput }> => {
  try {
    console.log(`Starting translateUserTask for userId: ${input.userId}`)

    const user = (await req.payload.findByID({
      collection: 'users',
      id: input.userId,
      depth: 1,
      locale: 'en',
    })) as User

    if (!user) {
      console.error(`User with ID ${input.userId} not found`)
      return { output: { success: false, message: `User with ID ${input.userId} not found` } }
    }

    console.log(`Found user: ${user.name} (ID: ${user.id})`)

    const hasTranslatableContent = typeof user.name === 'string' && user.name.length > 0

    if (!hasTranslatableContent) {
      console.log(`User ${user.name} has no translatable content, skipping translation`)
      return { output: { success: true, message: 'User has no translatable content' } }
    }

    for (const locale of SUPPORTED_LOCALES) {
      if (locale === 'en') continue
      try {
        const updatedData: Record<string, unknown> = {}

        if (typeof user.name === 'string' && user.name.length > 0) {
          updatedData.name = await translateText({ text: user.name, targetLang: locale })
        }

        if (Object.keys(updatedData).length > 0) {
          await req.payload.update({
            collection: 'users',
            id: input.userId,
            data: updatedData,
            locale: locale as SupportedLocale,
            draft: false,
            context: { disableRevalidate: true },
          })
          console.log(`Created translation for locale ${locale} of user: ${user.name}`)
        }
      } catch (error) {
        console.error(`Error translating user to ${locale}:`, error)
      }
    }

    return {
      output: { success: true, message: 'Created translations in all supported locales for user' },
    }
  } catch (error) {
    console.error('translateUserTask error:', error)
    return {
      output: {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}

export const translatePartOfSpeechTask = async ({
  input,
  req,
}: {
  input: TranslatePartOfSpeechTaskInput
  req: PayloadRequest
}): Promise<{ output: TranslatePartOfSpeechTaskOutput }> => {
  try {
    console.log(`Starting translatePartOfSpeechTask for partOfSpeechId: ${input.partOfSpeechId}`)

    const partOfSpeech = (await req.payload.findByID({
      collection: 'part-of-speech',
      id: input.partOfSpeechId,
      depth: 1,
      locale: 'en',
    })) as PartOfSpeech

    if (!partOfSpeech || partOfSpeech._status !== 'published') {
      console.error(`Part of speech with ID ${input.partOfSpeechId} not found or not published`)
      return {
        output: {
          success: false,
          message: `Part of speech with ID ${input.partOfSpeechId} not found or not published`,
        },
      }
    }

    console.log(`Found part of speech: ${partOfSpeech.name} (ID: ${partOfSpeech.id})`)

    const hasTranslatableContent =
      (typeof partOfSpeech.name === 'string' && partOfSpeech.name.length > 0) ||
      (partOfSpeech.description &&
        typeof partOfSpeech.description === 'object' &&
        partOfSpeech.description.root)

    if (!hasTranslatableContent) {
      console.log(
        `Part of speech ${partOfSpeech.name} has no translatable content, skipping translation`,
      )
      return { output: { success: true, message: 'Part of speech has no translatable content' } }
    }

    for (const locale of SUPPORTED_LOCALES) {
      if (locale === 'en') continue
      try {
        const updatedData: Record<string, unknown> = {}

        if (typeof partOfSpeech.name === 'string' && partOfSpeech.name.length > 0) {
          updatedData.name = await translateText({ text: partOfSpeech.name, targetLang: locale })
        }

        if (
          partOfSpeech.description &&
          typeof partOfSpeech.description === 'object' &&
          partOfSpeech.description.root
        ) {
          updatedData.description = {
            ...partOfSpeech.description,
            root: await translateLexicalNode(partOfSpeech.description.root, locale),
          }
        }

        if (Object.keys(updatedData).length > 0) {
          await req.payload.update({
            collection: 'part-of-speech',
            id: input.partOfSpeechId,
            data: updatedData,
            locale: locale as SupportedLocale,
            draft: true,
            context: { disableRevalidate: true },
          })
          console.log(
            `Created draft translation for locale ${locale} of part of speech: ${partOfSpeech.name}`,
          )
        }
      } catch (error) {
        console.error(`Error translating part of speech to ${locale}:`, error)
      }
    }

    return {
      output: {
        success: true,
        message: 'Created draft translations in all supported locales for part of speech',
      },
    }
  } catch (error) {
    console.error('translatePartOfSpeechTask error:', error)
    return {
      output: {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}

export const translateWord = async ({
  input,
  req,
}: {
  input: TranslateWordTaskInput
  req: PayloadRequest
}): Promise<{ output: TranslateWordTaskOutput }> => {
  try {
    console.log(`Starting translateWord for dictionaryId: ${input.dictionaryId}`)

    const dictionary = (await req.payload.findByID({
      collection: 'dictionary',
      id: input.dictionaryId,
      depth: 1,
      locale: 'en',
    })) as Dictionary

    if (!dictionary || dictionary._status !== 'published') {
      console.error(`Dictionary entry with ID ${input.dictionaryId} not found or not published`)
      return {
        output: {
          success: false,
          message: `Dictionary entry with ID ${input.dictionaryId} not found or not published`,
        },
      }
    }

    console.log(`Found dictionary entry: ${dictionary.word} (ID: ${dictionary.id})`)

    const hasTranslatableContent =
      (typeof dictionary.word === 'string' && dictionary.word.length > 0) ||
      (typeof dictionary.definitions === 'string' && dictionary.definitions.length > 0) ||
      (typeof dictionary.pronunciation === 'string' && dictionary.pronunciation.length > 0) ||
      (typeof dictionary.example === 'string' && dictionary.example.length > 0) ||
      (typeof dictionary.etymology === 'string' && dictionary.etymology.length > 0)

    if (!hasTranslatableContent) {
      console.log(
        `Dictionary entry ${dictionary.word} has no translatable content, skipping translation`,
      )
      return {
        output: { success: true, message: 'Dictionary entry has no translatable content' },
      }
    }

    for (const locale of SUPPORTED_LOCALES) {
      if (locale === 'en') continue
      try {
        const updatedData: Record<string, unknown> = {}

        if (typeof dictionary.word === 'string' && dictionary.word.length > 0) {
          updatedData.word = await translateText({ text: dictionary.word, targetLang: locale })
        }

        if (typeof dictionary.definitions === 'string' && dictionary.definitions.length > 0) {
          updatedData.definitions = await translateText({
            text: dictionary.definitions,
            targetLang: locale,
          })
        }

        if (typeof dictionary.pronunciation === 'string' && dictionary.pronunciation.length > 0) {
          updatedData.pronunciation = await translateText({
            text: dictionary.pronunciation,
            targetLang: locale,
          })
        }

        if (typeof dictionary.example === 'string' && dictionary.example.length > 0) {
          updatedData.example = await translateText({
            text: dictionary.example,
            targetLang: locale,
          })
        }

        if (typeof dictionary.etymology === 'string' && dictionary.etymology.length > 0) {
          updatedData.etymology = await translateText({
            text: dictionary.etymology,
            targetLang: locale,
          })
        }

        if (Object.keys(updatedData).length > 0) {
          await req.payload.update({
            collection: 'dictionary',
            id: input.dictionaryId,
            data: updatedData,
            locale: locale as SupportedLocale,
            draft: true,
            context: { disableRevalidate: true },
          })
          console.log(
            `Created draft translation for locale ${locale} of dictionary entry: ${dictionary.word}`,
          )
        }
      } catch (error) {
        console.error(`Error translating dictionary entry to ${locale}:`, error)
      }
    }

    return {
      output: {
        success: true,
        message: 'Created draft translations in all supported locales for dictionary entry',
      },
    }
  } catch (error) {
    console.error('translateWord error:', error)
    return {
      output: {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}
