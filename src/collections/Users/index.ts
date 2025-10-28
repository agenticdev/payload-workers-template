import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { anyone } from '@/access/anyone'
import { adminOrSelf } from '@/access/adminOrSelf'
import { checkRole } from '@/access/utilities'

import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { syncEditableToVisible } from './hooks/syncEditableToVisible'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => checkRole(['super-admin', 'admin', 'modifier'], user),
    create: anyone,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    group: 'Users',
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: {
    tokenExpiration: 1209600,
  },
  fields: [
    {
      name: 'password',
      type: 'text',
      required: false,
      validate: (value: unknown, { data, operation, req }: any) => {
        // Allow empty password if user has OAuth ID (Google, etc.)
        // Check if OAuth-related keys exist in the data object (even if undefined)
        // The OAuth plugin adds these keys during user creation
        const hasOAuthKeys = data && ('googleId' in data || 'sub' in data || 'googleProfileImage' in data)

        if (!value && hasOAuthKeys) {
          return true
        }

        // For updates, if the user already has an OAuth ID, don't require password
        if (!value && operation === 'update' && req?.user?.googleId) {
          return true
        }

        // For non-OAuth users, require password with minimum length
        if (!value) {
          return 'Password is required for non-OAuth users'
        }
        if (typeof value === 'string' && value.length < 3) {
          return 'Password must be at least 3 characters'
        }
        return true
      },
    },
    {
      name: 'name',
      type: 'text',
      localized: true,
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Image',
    },
    {
      name: 'googleId',
      type: 'text',
      label: 'Google ID',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: 'googleProfileImage',
      type: 'text',
      label: 'Google Profile Image URL',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Description',
    },
    {
      name: 'websiteURL',
      type: 'text',
      label: 'Website URL',
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Links',
      fields: [
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter',
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn',
        },
        {
          name: 'github',
          type: 'text',
          label: 'GitHub',
        },
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram',
        },
      ],
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ['user'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: 'Super Admin',
          value: 'super-admin',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Modifier',
          value: 'modifier',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },
    {
      name: 'editableCollections',
      type: 'select',
      hasMany: true,
      admin: {
        description: 'Collections this user can modify (only applies to admin and modifier roles)',
        condition: (data) => data?.roles?.includes('admin') || data?.roles?.includes('modifier'),
      },
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
      },
      options: [
        { label: 'Users', value: 'users' },
        { label: 'Media', value: 'media' },
      ],
    },
    {
      name: 'visibleCollections',
      type: 'select',
      hasMany: true,
      admin: {
        description:
          'Collections this user can view (editable collections are automatically included)',
        condition: (data) => data?.roles?.includes('admin') || data?.roles?.includes('modifier'),
        readOnly: false,
      },
      hooks: {
        beforeChange: [syncEditableToVisible],
      },
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
      },
      options: [
        { label: 'Users', value: 'users' },
        { label: 'Media', value: 'media' },
      ],
    },
  ],
  versions: {
    drafts: {
      autosave: {
        // Use environment variable for autosave interval (default: 10 seconds)
        // This reduces server load and prevents excessive requests during typing
        // Configure via PAYLOAD_AUTOSAVE_INTERVAL in .env
        interval: parseInt(process.env.PAYLOAD_AUTOSAVE_INTERVAL || '10000', 10),
      },
    },
  },
}
