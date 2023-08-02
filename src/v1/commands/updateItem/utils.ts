import type { SET, ADD, DELETE, APPEND, PREPEND } from './types'
import { $HAS_VERB, $SET, $ADD, $DELETE, $REMOVE, $APPEND, $PREPEND } from './constants'

export const $set = <VALUE>(value: VALUE): SET<VALUE> => ({ [$HAS_VERB]: true, [$SET]: value })

export const $add = <VALUE extends number | Set<number | string | Buffer>>(
  value: VALUE
): ADD<VALUE> => ({ [$HAS_VERB]: true, [$ADD]: value })

/**
 * @debt feature "TODO: find a better name as delete is a reserved keyword. Maybe use remove for both cases?"
 */
export const $delete = <VALUE extends number | Set<number | string | Buffer>>(
  value: VALUE
): DELETE<VALUE> => ({ [$HAS_VERB]: true, [$DELETE]: value })

export const $remove = (): $REMOVE => $REMOVE

export const $append = <VALUES extends unknown[]>(values: VALUES): APPEND<VALUES> => ({
  [$HAS_VERB]: true,
  [$APPEND]: values
})

export const $prepend = <VALUES extends unknown[]>(values: VALUES): PREPEND<VALUES> => ({
  [$HAS_VERB]: true,
  [$PREPEND]: values
})
