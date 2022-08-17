import type { EntityV2 } from '../class'
import type { Output, SavedAs } from '../generics'

type Parser = <
  E extends EntityV2,
  S extends Record<string, any> = SavedAs<E>,
  O extends Record<string, any> = Output<E>
>(
  entity: E,
  savedAs: S
) => O

/**
 * Parse saved item in DynamoDB to desired output for a given Entity
 *
 * @param entity Entity
 * @param savedAs Saved item
 * @return Object
 */
export const parse: Parser = (entity, savedAs) => {
  entity
  // TODO
  return savedAs as any
}
