import type { Attribute, AttributeValue } from 'v1/schema'

import type { SET, GET, SUM, SUBTRACT, ADD, DELETE, APPEND, PREPEND, Reference } from './types'
import {
  $HAS_VERB,
  $SET,
  $GET,
  $REMOVE,
  $SUM,
  $SUBTRACT,
  $ADD,
  $DELETE,
  $APPEND,
  $PREPEND
} from './constants'

export const $set = <VALUE>(value: VALUE): SET<VALUE> => ({ [$HAS_VERB]: true, [$SET]: value })

export const $get = <
  REFERENCE extends string,
  FALLBACK extends undefined | AttributeValue | Reference<Attribute, boolean, string> = undefined
>(
  reference: REFERENCE,
  fallback?: FALLBACK
): GET<FALLBACK extends undefined ? [REFERENCE] : [REFERENCE, FALLBACK]> => ({
  [$HAS_VERB]: true,
  [$GET]: (fallback === undefined ? [reference] : [reference, fallback]) as any
})

export const $remove = (): $REMOVE => $REMOVE

export const $sum = <A, B>(a: A, b: B): SUM<A, B> => ({ [$HAS_VERB]: true, [$SUM]: [a, b] })

export const $subtract = <A, B>(a: A, b: B): SUBTRACT<A, B> => ({
  [$HAS_VERB]: true,
  [$SUBTRACT]: [a, b]
})

export const $add = <VALUE>(value: VALUE): ADD<VALUE> => ({ [$HAS_VERB]: true, [$ADD]: value })

export const $delete = <VALUE>(value: VALUE): DELETE<VALUE> => ({
  [$HAS_VERB]: true,
  [$DELETE]: value
})

export const $append = <VALUE>(value: VALUE): APPEND<VALUE> => ({
  [$HAS_VERB]: true,
  [$APPEND]: value
})

export const $prepend = <VALUE>(value: VALUE): PREPEND<VALUE> => ({
  [$HAS_VERB]: true,
  [$PREPEND]: value
})
