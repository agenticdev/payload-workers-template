import type { CollectionConfig } from 'payload'

import { canViewCollection } from '@/access/canViewCollection'
import { canEditCollection } from '@/access/canEditCollection'
import { adminOnly } from '@/access/adminOnly'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: canEditCollection('media'),
    read: canViewCollection('media'),
    update: canEditCollection('media'),
    delete: adminOnly,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // These are not supported on Workers yet due to lack of sharp
    crop: false,
    focalPoint: false,
  },
}
