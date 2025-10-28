import { CollectionConfig, CollectionSlug } from 'payload'
import { slugField } from '@/fields/slug'
// import { superAdminOrTenantAdminAccessDictionary } from './access/superAdminOrTenantAdmin';
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { authenticated } from '@/access/authenticated'
// removed: triggerGenerateMarkdown
// removed: deleteMarkdown
// import { triggerTranslateWord } from './hooks/triggerTranslateWord';

const Dictionary: CollectionConfig = {
  slug: 'dictionary',
  admin: {
    useAsTitle: 'word',
    group: 'Dictionary/Language',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  hooks: {
    // afterChange: [triggerTranslateWord],
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
      relationTo: 'part-of-speech' as CollectionSlug,
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
          const invalidIds = value.filter((id) => typeof id !== 'string' && typeof id !== 'number')
          if (invalidIds.length > 0) {
            return 'Invalid relationship IDs found'
          }
        }
        return true
      },
      hasMany: true,
      relationTo: 'dictionary' as CollectionSlug,
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
          const invalidIds = value.filter((id) => typeof id !== 'string' && typeof id !== 'number')
          if (invalidIds.length > 0) {
            return 'Invalid relationship IDs found'
          }
        }
        return true
      },
      hasMany: true,
      relationTo: 'dictionary' as CollectionSlug,
    },
    ...slugField('word'),
  ],
  versions: {
    drafts: {
      // Autosave disabled to prevent requests on every keystroke
      // Users must manually save using Cmd+S or the Save button
      autosave: false,
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}

export default Dictionary
