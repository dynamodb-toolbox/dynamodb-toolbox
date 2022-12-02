import type { EntityV2 } from '../class'
import type { UpdateItemInput } from '../generics'

type UpdateItemInputValidator = <
  ENTITY extends EntityV2,
  UPDATE_ITEM_INPUT extends Record<string, any> = UpdateItemInput<ENTITY>
>(
  entity: ENTITY,
  updateItemInput: Record<string, any>
) => updateItemInput is UPDATE_ITEM_INPUT

/**
 * Validate the input of an UPDATE command for a given Entity
 *
 * @param entity Entity
 * @param updateItemInput UpdateItemInput
 * @return Boolean
 */
export const validateUpdateItemInput: UpdateItemInputValidator = <
  ENTITY extends EntityV2,
  UPDATE_ITEM_INPUT extends Record<string, any> = UpdateItemInput<ENTITY>
>(
  entity: ENTITY,
  updateItemInput: Record<string, any>
): updateItemInput is UPDATE_ITEM_INPUT => {
  entity
  updateItemInput
  // TODO
  return true
}
