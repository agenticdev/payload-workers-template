import type { Access } from 'payload'

import { checkRole } from '@/access/utilities'

/**
 * Check if user can edit a specific collection
 * - Super Admins can edit all collections
 * - Admins can edit collections in their editableCollections
 * - Modifiers can edit collections in their editableCollections
 * - Users cannot edit any collections
 */
export const canEditCollection = (collectionSlug: string): Access => {
  return ({ req: { user } }) => {
    if (!user) return false

    // Super Admins can edit everything
    if (checkRole(['super-admin'], user)) {
      return true
    }

    // Admins and Modifiers can only edit their assigned collections
    if (checkRole(['admin', 'modifier'], user)) {
      return user.editableCollections?.includes(collectionSlug as any) || false
    }

    // Users cannot edit
    return false
  }
}
