import type { EntityV2 } from '../class'
import type { PutItemInput } from '../generics'

type PutItemInputValidator = <
  ENTITY extends EntityV2,
  PUT_ITEM_INPUT extends Record<string, any> = PutItemInput<ENTITY>
>(
  entity: ENTITY,
  putItemInput: Record<string, any>
) => putItemInput is PUT_ITEM_INPUT

/**
 * Validate the input of a PUT command for a given Entity
 *
 * @param entity Entity
 * @param putItemInput PutItemInput
 * @return Boolean
 */
export const validatePutItemInput: PutItemInputValidator = <
  ENTITY extends EntityV2,
  PUT_ITEM_INPUT extends Record<string, any> = PutItemInput<ENTITY>
>(
  entity: ENTITY,
  putItemInput: Record<string, any>
): putItemInput is PUT_ITEM_INPUT => {
  entity
  putItemInput
  // TODO
  return true
}
