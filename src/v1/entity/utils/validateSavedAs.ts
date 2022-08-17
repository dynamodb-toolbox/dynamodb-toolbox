import type { EntityV2 } from '../class'
import type { SavedAs } from '../generics'

type SavedAsValidator = <E extends EntityV2, S extends Record<string, any> = SavedAs<E>>(
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
export const validateSavedAs: SavedAsValidator = <
  E extends EntityV2,
  S extends Record<string, any> = SavedAs<E>
>(
  entity: E,
  savedItem: Record<string, any>
): savedItem is S => {
  entity
  savedItem
  // TODO
  return true
}
