import type { EntityV2 } from '../class'
import type { FormattedItem, SavedItem } from '../generics'

type Formatter = <
  E extends EntityV2,
  S extends Record<string, any> = SavedItem<E>,
  F extends Record<string, any> = FormattedItem<E>
>(
  entity: E,
  savedItem: S
) => F

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
