import type { Access } from 'payload'

import { checkRole } from '@/access/utilities'

/**
 * Check if user can view a specific collection
 * - Admins can view all collections
 * - Editors can view collections in their visibleCollections
 * - Viewers can view collections in their visibleCollections
 */
export const canViewCollection = (collectionSlug: string): Access => {
  return ({ req: { user } }) => {
    if (!user) return false

    // Admins can view everything
    if (checkRole(['admin'], user)) {
      return true
    }

    // Editors and viewers can only view their assigned collections
    if (checkRole(['editor', 'viewer'], user)) {
      return user.visibleCollections?.includes(collectionSlug) || false
    }

    return false
  }
}
