import type { EntityV2 } from '../class'
import type { PutItemInput } from '../generics'

type PutItemInputValidator = <
  EntityInput extends EntityV2,
  EntityPutItemInput extends Record<string, any> = PutItemInput<EntityInput>
>(
  entity: EntityInput,
  putItemInput: Record<string, any>
) => putItemInput is EntityPutItemInput

/**
 * Validate the input of a PUT command for a given Entity
 *
 * @param entity Entity
 * @param putItemInput PutItemInput
 * @return Boolean
 */
export const validatePutItemInput: PutItemInputValidator = <
  EntityInput extends EntityV2,
  EntityPutItemInput extends Record<string, any> = PutItemInput<EntityInput>
>(
  entity: EntityInput,
  putItemInput: Record<string, any>
): putItemInput is EntityPutItemInput => {
  entity
  putItemInput
  // TODO
  return true
}
