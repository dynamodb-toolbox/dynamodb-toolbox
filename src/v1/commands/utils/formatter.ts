import type { EntityV2, FormattedItem, SavedItem } from 'v1'

type Formatter = <
  ENTITY extends EntityV2,
  SAVED_ITEM extends Record<string, any> = SavedItem<ENTITY>,
  FORMATTED_ITEM extends Record<string, any> = FormattedItem<ENTITY>
>(
  entity: ENTITY,
  savedItem: SAVED_ITEM
) => FORMATTED_ITEM

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
