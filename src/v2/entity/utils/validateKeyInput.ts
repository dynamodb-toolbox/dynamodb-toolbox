import type { EntityV2 } from '../class'
import type { KeyInputs } from '../generics'

type KeyInputsValidator = <E extends EntityV2, K extends Record<string, any> = KeyInputs<E>>(
  entity: E,
  keyInputs: Record<string, any>
) => keyInputs is K

export const validateKeyInputs: KeyInputsValidator = <
  E extends EntityV2,
  K extends Record<string, any> = KeyInputs<E>
>(
  entity: E,
  keyInputs: Record<string, any>
): keyInputs is K => {
  entity
  keyInputs
  // TODO
  return true
}
