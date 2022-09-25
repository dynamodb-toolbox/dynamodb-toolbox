import type { EntityV2 } from '../class'
import type { FormattedItem, SavedItem } from '../generics'

type Formatter = <
  EntityInput extends EntityV2,
  EntitySavedItem extends Record<string, any> = SavedItem<EntityInput>,
  EntityFormattedItem extends Record<string, any> = FormattedItem<EntityInput>
>(
  entity: EntityInput,
  savedItem: EntitySavedItem
) => EntityFormattedItem

/**
 * Format saved item in DynamoDB to desired output for a given Entity
 *
 * @param entity Entity
 * @param savedItem Saved item
 * @return Object
 */
export const format: Formatter = (entity, savedItem) => {
  entity
  // TODO
  return savedItem as any
}
