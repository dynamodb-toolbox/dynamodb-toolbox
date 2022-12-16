import type { EntityV2, SavedItem } from 'v1'

type SavedItemValidator = <
  ENTITY extends EntityV2,
  SAVED_ITEM extends Record<string, any> = SavedItem<ENTITY>
>(
  entity: ENTITY,
  savedItem: Record<string, any>
) => savedItem is SAVED_ITEM

/**
 * Validates the saved item in DynamoDB for a given Entity
 *
 * @param entity Entity
 * @param savedItem Saved Item
 * @return Boolean
 */
export const validateSavedItem: SavedItemValidator = <
  ENTITY extends EntityV2,
  SAVED_ITEM extends Record<string, any> = SavedItem<ENTITY>
>(
  entity: ENTITY,
  savedItem: Record<string, any>
): savedItem is SAVED_ITEM => {
  entity
  savedItem
  // TODO
  return true
}
