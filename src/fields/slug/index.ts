import type { CheckboxField, TextField, CollectionSlug } from 'payload'
import { ValidationError } from 'payload'

import { formatSlugHook } from './formatSlug'

type Overrides = {
  slugOverrides?: Partial<TextField>
  checkboxOverrides?: Partial<CheckboxField>
  collection?: string
}

type Slug = (fieldToUse?: string, overrides?: Overrides) => [TextField, CheckboxField]

export const slugField: Slug = (fieldToUse = 'title', overrides = {}) => {
  const { slugOverrides, checkboxOverrides, collection } = overrides

  const checkBoxField: CheckboxField = {
    name: 'slugLock',
    type: 'checkbox',
    defaultValue: true,
    admin: {
      hidden: true,
      position: 'sidebar',
    },
    ...checkboxOverrides,
  }

  // @ts-expect-error - ts mismatch Partial<TextField> with TextField
  const slugField: TextField = {
    name: 'slug',
    type: 'text',
    index: true,
    localized: true,
    label: 'Slug',
    ...(slugOverrides || {}),
    hooks: {
      // Kept this in for hook or API based updates
      beforeValidate: [formatSlugHook(fieldToUse)],
      beforeChange: [
        async ({ value, req, data }) => {
          if (!value) return value;

          // Check for duplicate slugs if collection is specified
          if (collection) {
            const existingDoc = await req.payload.find({
              collection: collection as CollectionSlug,
              where: {
                slug: { equals: value },
                id: { not_equals: data?.id || '' }
              },
              limit: 1,
            });

            if (existingDoc.docs.length > 0) {
              throw new ValidationError({
                errors: [
                  {
                    message: `A ${collection.slice(0, -1)} with the slug "${value}" already exists. Please choose a different slug.`,
                    path: 'slug',
                  },
                ],
              });
            }
          }

          return value;
        }
      ],
    },
    admin: {
      position: 'sidebar',
      ...(slugOverrides?.admin || {}),
      components: {
        Field: {
          path: '@/fields/slug/SlugComponent#SlugComponent',
          clientProps: {
            fieldToUse,
            checkboxFieldPath: checkBoxField.name,
          },
        },
      },
    },
  }

  return [slugField, checkBoxField]
}
