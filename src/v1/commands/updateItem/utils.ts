import type { SET, GET, ADD, DELETE, APPEND, PREPEND } from './types'
import { $HAS_VERB, $SET, $GET, $ADD, $DELETE, $REMOVE, $APPEND, $PREPEND } from './constants'

export const $set = <VALUE>(value: VALUE): SET<VALUE> => ({ [$HAS_VERB]: true, [$SET]: value })

export const $get = <VALUE>(value: VALUE): GET<VALUE> => ({ [$HAS_VERB]: true, [$GET]: value })

export const $add = <VALUE>(value: VALUE): ADD<VALUE> => ({ [$HAS_VERB]: true, [$ADD]: value })

export const $delete = <VALUE>(value: VALUE): DELETE<VALUE> => ({
  [$HAS_VERB]: true,
  [$DELETE]: value
})

export const $remove = (): $REMOVE => $REMOVE

export const $append = <VALUE>(value: VALUE): APPEND<VALUE> => ({
  [$HAS_VERB]: true,
  [$APPEND]: value
})

export const $prepend = <VALUE>(value: VALUE): PREPEND<VALUE> => ({
  [$HAS_VERB]: true,
  [$PREPEND]: value
})
