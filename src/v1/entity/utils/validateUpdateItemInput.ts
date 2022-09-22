import type { EntityV2 } from '../class'
import type { UpdateItemInput } from '../generics'

type UpdateItemInputValidator = <
  EntityInput extends EntityV2,
  EntityUpdateItem extends Record<string, any> = UpdateItemInput<EntityInput>
>(
  entity: EntityInput,
  updateItemInput: Record<string, any>
) => updateItemInput is EntityUpdateItem

/**
 * Validate the input of an UPDATE command for a given Entity
 *
 * @param entity Entity
 * @param updateItemInput UpdateItemInput
 * @return Boolean
 */
export const validateUpdateItemInput: UpdateItemInputValidator = <
  EntityInput extends EntityV2,
  EntityUpdateItem extends Record<string, any> = UpdateItemInput<EntityInput>
>(
  entity: EntityInput,
  updateItemInput: Record<string, any>
): updateItemInput is EntityUpdateItem => {
  entity
  updateItemInput
  // TODO
  return true
}
