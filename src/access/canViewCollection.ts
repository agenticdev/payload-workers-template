import type { Access } from 'payload'

import { checkRole } from '@/access/utilities'

/**
 * Check if user can view a specific collection
 * - Admins can view all collections
 * - Editors can view collections in their visibleCollections OR editableCollections
 * - Viewers can view collections in their visibleCollections
 */
export const canViewCollection = (collectionSlug: string): Access => {
  return ({ req: { user } }) => {
    if (!user) return false

    // Admins can view everything
    if (checkRole(['admin'], user)) {
      return true
    }

    // Editors can view collections in their visibleCollections OR editableCollections
    if (checkRole(['editor'], user)) {
      const canView = user.visibleCollections?.includes(collectionSlug) || false
      const canEdit = user.editableCollections?.includes(collectionSlug) || false
      return canView || canEdit
    }

    // Viewers can only view their assigned collections
    if (checkRole(['viewer'], user)) {
      return user.visibleCollections?.includes(collectionSlug) || false
    }

    return false
  }
}
