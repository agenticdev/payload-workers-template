import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { publicAccess } from '@/access/publicAccess'
import { adminOrSelf } from '@/access/adminOrSelf'
import { checkRole } from '@/access/utilities'

import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => checkRole(['admin', 'editor', 'viewer'], user),
    create: publicAccess,
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
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Viewer',
          value: 'viewer',
        },
      ],
    },
    {
      name: 'visibleCollections',
      type: 'select',
      hasMany: true,
      admin: {
        description: 'Collections this user can view',
        condition: (data) => data?.roles?.includes('editor') || data?.roles?.includes('viewer'),
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
      name: 'editableCollections',
      type: 'select',
      hasMany: true,
      admin: {
        description: 'Collections this editor can modify (only applies to editor role)',
        condition: (data) => data?.roles?.includes('editor'),
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
