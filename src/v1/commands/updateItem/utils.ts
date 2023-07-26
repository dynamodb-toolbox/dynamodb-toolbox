import { $add, $delete, $remove } from './constants'

export const add = <VALUE extends number | Set<number | string | Buffer>>(
  value: VALUE
): { [$add]: VALUE } => ({ [$add]: value })

/**
 * @debt feature "TODO: find a better name as delete is a reserved keyword. Maybe use remove for both cases?"
 */
export const _delete = <VALUE extends number | Set<number | string | Buffer>>(
  value: VALUE
): { [$delete]: VALUE } => ({ [$delete]: value })

export const remove = (): $remove => $remove
