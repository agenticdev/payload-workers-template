import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    ...slugField('title', {
      collection: 'categories',
      slugOverrides: {
        admin: {
          position: undefined,
        }
      }
    }),
  ],
  versions: {
    drafts: {
      // Autosave disabled to prevent requests on every keystroke
      // Users must manually save using Cmd+S or the Save button
      autosave: false,
    },
  },
}
