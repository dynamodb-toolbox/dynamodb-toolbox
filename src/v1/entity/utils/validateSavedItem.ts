import type { EntityV2 } from '../class'
import type { SavedItem } from '../generics'

type SavedItemValidator = <E extends EntityV2, S extends Record<string, any> = SavedItem<E>>(
  entity: E,
  savedItem: Record<string, any>
) => savedItem is S

/**
 * Validates the saved item in DynamoDB for a given Entity
 *
 * @param entity Entity
 * @param savedItem Saved Item
 * @return Boolean
 */
export const validateSavedItem: SavedItemValidator = <
  E extends EntityV2,
  S extends Record<string, any> = SavedItem<E>
>(
  entity: E,
  savedItem: Record<string, any>
): savedItem is S => {
  entity
  savedItem
  // TODO
  return true
}
