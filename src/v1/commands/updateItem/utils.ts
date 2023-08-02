import { $SET, $PARTIAL, $ADD, $DELETE, $REMOVE } from './constants'

export const $set = <VALUE>(value: VALUE): { [$PARTIAL]?: false; [$SET]: VALUE } => ({
  [$SET]: value
})

export const $add = <VALUE extends number | Set<number | string | Buffer>>(
  value: VALUE
): { [$ADD]: VALUE } => ({ [$ADD]: value })

/**
 * @debt feature "TODO: find a better name as delete is a reserved keyword. Maybe use remove for both cases?"
 */
export const $delete = <VALUE extends number | Set<number | string | Buffer>>(
  value: VALUE
): { [$DELETE]: VALUE } => ({ [$DELETE]: value })

export const $remove = (): $REMOVE => $REMOVE
