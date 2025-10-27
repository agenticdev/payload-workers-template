import { PayloadRequest } from "payload";
import OpenAI from 'openai'

const SUPPORTED_LOCALES = ['en', 'bg', 'tr', 'fr', 'es', 'de', 'it', 'nl', 'pl', 'sv', 'ja', 'zh', 'ar'] as const;
type SupportedLocale = typeof SUPPORTED_LOCALES[number];

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function translateText({ text, targetLang }: { text: string; targetLang: string }) {
    const translationPrompt = `Translate the following text to ${targetLang} (preserve any markdown formatting, HTML tags, or special characters):\n\n${text}`
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: translationPrompt }],
        max_tokens: 2048,
    })
    return response.choices?.[0]?.message?.content?.trim() ?? ''
}

export interface TriggerTranslateWordInput {
    dictionaryId: number
}

export interface TriggerTranslateWordOutput {
    success: boolean
    message: string
}

export const translateWord = async ({
    input,
    req,
}: {
    input: TriggerTranslateWordInput
    req: PayloadRequest
}): Promise<{ output: TriggerTranslateWordOutput }> => {
    try {
        const dictionary = await req.payload.findByID({
            collection: 'dictionary',
            id: input.dictionaryId,
            depth: 1,
            locale: 'en',
        })

        if (!dictionary || dictionary._status !== 'published') {
            return { output: { success: false, message: 'Dictionary entry not found or not published' } }
        }

        // Translate all localized fields and meta fields to all supported locales except 'en'
        for (const locale of SUPPORTED_LOCALES) {
            if (locale === 'en') continue;
            try {
                // Translate all fields in parallel for this locale
                const [
                    translatedWord,
                    translatedDefinitions,
                    translatedPronunciation,
                    translatedExample,
                    translatedEtymology
                ] = await Promise.all([
                    translateText({ text: dictionary.word, targetLang: locale }),
                    translateText({ text: dictionary.definitions, targetLang: locale }),
                    dictionary.pronunciation ? translateText({ text: dictionary.pronunciation, targetLang: locale }) : Promise.resolve(undefined),
                    dictionary.example ? translateText({ text: dictionary.example, targetLang: locale }) : Promise.resolve(undefined),
                    dictionary.etymology ? translateText({ text: dictionary.etymology, targetLang: locale }) : Promise.resolve(undefined),
                ])

                // Translate meta fields in parallel if present
                const translatedMeta = dictionary.meta ? { ...dictionary.meta } : undefined;
                if (translatedMeta) {
                    const [metaTitle, metaDescription] = await Promise.all([
                        translatedMeta.title ? translateText({ text: translatedMeta.title, targetLang: locale }) : Promise.resolve(undefined),
                        translatedMeta.description ? translateText({ text: translatedMeta.description, targetLang: locale }) : Promise.resolve(undefined),
                    ])
                    if (metaTitle) translatedMeta.title = metaTitle;
                    if (metaDescription) translatedMeta.description = metaDescription;
                }

                // Create draft in target locale
                await req.payload.update({
                    collection: 'dictionary',
                    id: input.dictionaryId,
                    data: {
                        word: translatedWord,
                        definitions: translatedDefinitions,
                        ...(translatedPronunciation ? { pronunciation: translatedPronunciation } : {}),
                        ...(translatedExample ? { example: translatedExample } : {}),
                        ...(translatedEtymology ? { etymology: translatedEtymology } : {}),
                        ...(translatedMeta ? { meta: translatedMeta } : {}),
                    },
                    locale: locale as SupportedLocale,
                    draft: true,
                    context: {
                        disableRevalidate: true
                    }
                })

                console.log(`Created draft translation for locale ${locale} of dictionary entry: ${dictionary.word}`)
            } catch (error) {
                console.error(`Error translating dictionary to ${locale}:`, error)
                // Continue with next locale even if one fails
            }
        }
        return { output: { success: true, message: 'Created draft translations in all supported locales' } }
    } catch (error) {
        console.error('Dictionary translation task error:', error)
        return { output: { success: false, message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` } }
    }
}
