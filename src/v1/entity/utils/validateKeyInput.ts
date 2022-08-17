import type { EntityV2 } from '../class'
import type { KeyInput } from '../generics'

type KeyInputValidator = <E extends EntityV2, K extends Record<string, any> = KeyInput<E>>(
  entity: E,
  keyInput: Record<string, any>
) => keyInput is K

/**
 * Validates the primary key input of a single item command (GET, DELETE ...) for a given Entity
 *
 * @param entity Entity
 * @param keyInput Key input
 * @return Boolean
 */
export const validateKeyInput: KeyInputValidator = <
  E extends EntityV2,
  K extends Record<string, any> = KeyInput<E>
>(
  entity: E,
  keyInput: Record<string, any>
): keyInput is K => {
  entity
  keyInput
  // TODO
  return true
}
