import type { EntityV2 } from '../class'
import type { Input } from '../generics'

type InputValidator = <E extends EntityV2, I extends Record<string, any> = Input<E>>(
  entity: E,
  input: Record<string, any>
) => input is I

/**
 * Validate the input of a PUT command for a given Entity
 *
 * @param entity Entity
 * @param input Input
 * @return Boolean
 */
export const validateInput: InputValidator = <
  E extends EntityV2,
  I extends Record<string, any> = Input<E>
>(
  entity: E,
  input: Record<string, any>
): input is I => {
  entity
  input
  // TODO
  return true
}
