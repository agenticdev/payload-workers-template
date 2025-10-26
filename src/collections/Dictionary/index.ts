import { CollectionConfig, CollectionSlug } from 'payload';
import { slugField } from '@/fields/slug'
import { superAdminOrTenantAdminAccessDictionary } from './access/superAdminOrTenantAdmin';
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished';
// removed: triggerGenerateMarkdown
// removed: deleteMarkdown
import { triggerTranslateWord } from './hooks/triggerTranslateWord';

const Dictionary: CollectionConfig = {
    slug: 'dictionary',
    admin: {
        useAsTitle: 'word',
        group: 'Dictionary/Language',
    },
    access: {
        create: superAdminOrTenantAdminAccessDictionary,
        delete: superAdminOrTenantAdminAccessDictionary,
        read: authenticatedOrPublished,
        update: superAdminOrTenantAdminAccessDictionary,
    },
    hooks: {
        afterChange: [
            triggerTranslateWord,
        ],
    },
    fields: [
        {
            name: 'publishedAt',
            type: 'date',
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                },
                position: 'sidebar',
            },
            hooks: {
                beforeChange: [
                    ({ siblingData, value }) => {
                        if (siblingData._status === 'published' && !value) {
                            return new Date()
                        }
                        return value
                    },
                ],
            },
        },
        {
            name: 'word',
            type: 'text',
            required: true,
            localized: true,
        },
        {
            name: 'definitions',
            type: 'textarea',
            required: true,
            localized: true,
        },
        {
            name: 'pronunciation',
            type: 'text',
            localized: true,
        },
        {
            name: 'part_of_speech',
            type: 'relationship',
            admin: {
                position: 'sidebar',
            },
            relationTo: 'part-of-speech' satisfies CollectionSlug,
            required: true,
            hasMany: false,
        },
        {
            name: 'example',
            type: 'text',
            localized: true,
        },
        {
            name: 'etymology',
            type: 'text',
            localized: true,
        },
        {
            name: 'synonyms',
            type: 'relationship',
            admin: {
                position: 'sidebar',
            },
            filterOptions: ({ id, data }) => {
                return {
                    id: {
                        not_in: [id, ...(data?.antonyms || [])],
                    },
                }
            },
            validate: (value) => {
                if (value && Array.isArray(value)) {
                    const invalidIds = value.filter(id => typeof id !== 'string' && typeof id !== 'number');
                    if (invalidIds.length > 0) {
                        return 'Invalid relationship IDs found';
                    }
                }
                return true;
            },
            hasMany: true,
            relationTo: 'dictionary' satisfies CollectionSlug,
        },
        {
            name: 'antonyms',
            type: 'relationship',
            admin: {
                position: 'sidebar',
            },
            filterOptions: ({ id, data }) => {
                return {
                    id: {
                        not_in: [id, ...(data?.synonyms || [])],
                    },
                }
            },
            validate: (value) => {
                if (value && Array.isArray(value)) {
                    const invalidIds = value.filter(id => typeof id !== 'string' && typeof id !== 'number');
                    if (invalidIds.length > 0) {
                        return 'Invalid relationship IDs found';
                    }
                }
                return true;
            },
            hasMany: true,
            relationTo: 'dictionary' satisfies CollectionSlug,
        },
        ...slugField('word'),
    ],
    versions: {
        drafts: {
            autosave: {
                interval: 100,
            },
            schedulePublish: true,
        },
        maxPerDoc: 50,
    },
};

export default Dictionary;
