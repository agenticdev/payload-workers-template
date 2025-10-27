import { slugField } from '@/fields/slug'
import { CollectionConfig } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'
// import { triggerTranslatePartOfSpeech } from './hooks/triggerTranslatePartOfSpeech';

const PartOfSpeech: CollectionConfig = {
  slug: 'part-of-speech',
  admin: {
    useAsTitle: 'name', // Use the 'name' field as the title in the admin panel
    group: 'Dictionary/Language',
    defaultColumns: ['name', '_status', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true, // This field will be translatable
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      localized: true,
      editor: defaultLexical,
    },
    ...slugField('name'),
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
  ],
  hooks: {
    // afterChange: [triggerTranslatePartOfSpeech],
  },
  versions: {
    drafts: {
      autosave: {
        // Use environment variable for autosave interval (default: 10 seconds)
        // This reduces server load and prevents excessive requests during typing
        // Configure via PAYLOAD_AUTOSAVE_INTERVAL in .env
        interval: parseInt(process.env.PAYLOAD_AUTOSAVE_INTERVAL || '10000', 10),
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}

export default PartOfSpeech
