import type { Access } from 'payload'

import { checkRole } from '@/access/utilities'

/**
 * Check if user can view a specific collection
 * - Super Admins can view all collections
 * - Admins can view collections in their visibleCollections OR editableCollections
 * - Modifiers can view collections in their visibleCollections OR editableCollections
 * - Users cannot view admin collections
 */
export const canViewCollection = (collectionSlug: string): Access => {
  return ({ req: { user } }) => {
    if (!user) return false

    // Super Admins can view everything
    if (checkRole(['super-admin'], user)) {
      return true
    }

    // Admins and Modifiers can view collections in their visibleCollections OR editableCollections
    if (checkRole(['admin', 'modifier'], user)) {
      const canView = user.visibleCollections?.includes(collectionSlug as any) || false
      const canEdit = user.editableCollections?.includes(collectionSlug as any) || false
      return canView || canEdit
    }

    // Users cannot view admin collections
    return false
  }
}
