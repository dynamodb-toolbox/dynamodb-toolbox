import type { EntityV2 } from '../class'
import type { UpdateItemInput } from '../generics'

type UpdateItemInputValidator = <
  E extends EntityV2,
  I extends Record<string, any> = UpdateItemInput<E>
>(
  entity: E,
  updateItemInput: Record<string, any>
) => updateItemInput is I

/**
 * Validate the input of an UPDATE command for a given Entity
 *
 * @param entity Entity
 * @param updateItemInput UpdateItemInput
 * @return Boolean
 */
export const validateUpdateItemInput: UpdateItemInputValidator = <
  E extends EntityV2,
  I extends Record<string, any> = UpdateItemInput<E>
>(
  entity: E,
  updateItemInput: Record<string, any>
): updateItemInput is I => {
  entity
  updateItemInput
  // TODO
  return true
}
