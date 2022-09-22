import type { EntityV2 } from '../class'
import type { SavedItem } from '../generics'

type SavedItemValidator = <
  EntityInput extends EntityV2,
  EntitySavedItem extends Record<string, any> = SavedItem<EntityInput>
>(
  entity: EntityInput,
  savedItem: Record<string, any>
) => savedItem is EntitySavedItem

/**
 * Validates the saved item in DynamoDB for a given Entity
 *
 * @param entity Entity
 * @param savedItem Saved Item
 * @return Boolean
 */
export const validateSavedItem: SavedItemValidator = <
  EntityInput extends EntityV2,
  EntitySavedItem extends Record<string, any> = SavedItem<EntityInput>
>(
  entity: EntityInput,
  savedItem: Record<string, any>
): savedItem is EntitySavedItem => {
  entity
  savedItem
  // TODO
  return true
}
