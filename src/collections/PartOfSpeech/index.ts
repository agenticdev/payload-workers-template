import { slugField } from '@/fields/slug';
import { CollectionConfig } from 'payload';
import { defaultLexical } from '@/fields/defaultLexical'
import { triggerTranslatePartOfSpeech } from './hooks/triggerTranslatePartOfSpeech';

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
        afterChange: [triggerTranslatePartOfSpeech],
    },
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

export default PartOfSpeech;
