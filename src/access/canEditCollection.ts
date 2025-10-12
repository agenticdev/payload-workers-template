import type { Access } from 'payload'

import { checkRole } from '@/access/utilities'

/**
 * Check if user can edit a specific collection
 * - Admins can edit all collections
 * - Editors can edit collections in their editableCollections
 * - Viewers cannot edit any collections
 */
export const canEditCollection = (collectionSlug: string): Access => {
  return ({ req: { user } }) => {
    if (!user) return false

    // Admins can edit everything
    if (checkRole(['admin'], user)) {
      return true
    }

    // Editors can only edit their assigned collections
    if (checkRole(['editor'], user)) {
      return user.editableCollections?.includes(collectionSlug) || false
    }

    // Viewers cannot edit
    return false
  }
}
