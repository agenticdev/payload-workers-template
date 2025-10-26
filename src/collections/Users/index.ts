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
}
