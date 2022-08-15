import type { EntityV2 } from '../class'
import type { Input } from '../generics'

type InputValidator = <E extends EntityV2, I extends Record<string, any> = Input<E>>(
  entity: E,
  input: Record<string, any>
) => input is I

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
