import type { EntityV2 } from '../class'
import type { PutItemInput } from '../generics'

type PutItemInputValidator = <E extends EntityV2, I extends Record<string, any> = PutItemInput<E>>(
  entity: E,
  putItemInput: Record<string, any>
) => putItemInput is I

/**
 * Validate the input of a PUT command for a given Entity
 *
 * @param entity Entity
 * @param putItemInput PutItemInput
 * @return Boolean
 */
export const validatePutItemInput: PutItemInputValidator = <
  E extends EntityV2,
  I extends Record<string, any> = PutItemInput<E>
>(
  entity: E,
  putItemInput: Record<string, any>
): putItemInput is I => {
  entity
  putItemInput
  // TODO
  return true
}
