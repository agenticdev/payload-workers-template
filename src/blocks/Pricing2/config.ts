import type { Block } from 'payload'

export const Pricing2: Block = {
  slug: 'Pricing2',
  interfaceName: 'Pricing2Block',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Pricing',
      label: 'Heading',
    },
    {
      name: 'description',
      type: 'text',
      defaultValue: 'Check out our affordable pricing plans',
      label: 'Description',
    },
    {
      name: 'plans',
      type: 'array',
      label: 'Pricing Plans',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
          label: 'Plan ID',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Plan Name',
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Plan Description',
        },
        {
          name: 'monthlyPrice',
          type: 'text',
          required: true,
          label: 'Monthly Price',
        },
        {
          name: 'yearlyPrice',
          type: 'text',
          required: true,
          label: 'Yearly Price',
        },
        {
          name: 'features',
          type: 'array',
          label: 'Features',
          minRows: 1,
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              label: 'Feature Text',
            },
          ],
        },
        {
          name: 'button',
          type: 'group',
          label: 'Button',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              label: 'Button Text',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'Button URL',
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Pricing Blocks',
    singular: 'Pricing Block',
  },
}
