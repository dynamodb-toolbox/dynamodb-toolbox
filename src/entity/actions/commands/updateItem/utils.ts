import type { Attribute, AttributeValue } from '~/schema/attributes/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { SET, GET, SUM, SUBTRACT, ADD, DELETE, APPEND, PREPEND, Reference } from './types.js'
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
} from './constants.js'

export const $set = <VALUE>(value: VALUE): SET<VALUE> => ({ [$HAS_VERB]: true, [$SET]: value })

export const isSetUpdate = (input: unknown): input is { [$SET]: unknown } =>
  isObject(input) && $SET in input

export const $get = <
  REFERENCE extends string,
  FALLBACK extends undefined | AttributeValue | Reference<Attribute, string> = undefined
>(
  reference: REFERENCE,
  fallback?: FALLBACK
): GET<FALLBACK extends undefined ? [REFERENCE] : [REFERENCE, FALLBACK]> => ({
  [$HAS_VERB]: true,
  [$GET]: (fallback === undefined ? [reference] : [reference, fallback]) as any
})

export const isReferenceUpdate = (input: unknown): input is { [$GET]: unknown } =>
  isObject(input) && $GET in input

export const $remove = (): $REMOVE => $REMOVE

export const $sum = <A, B>(a: A, b: B): SUM<A, B> => ({ [$HAS_VERB]: true, [$SUM]: [a, b] })

export const isSumUpdate = (input: unknown): input is { [$SUM]: unknown } =>
  isObject(input) && $SUM in input

export const $subtract = <A, B>(a: A, b: B): SUBTRACT<A, B> => ({
  [$HAS_VERB]: true,
  [$SUBTRACT]: [a, b]
})

export const isSubtractUpdate = (input: unknown): input is { [$SUBTRACT]: unknown } =>
  isObject(input) && $SUBTRACT in input

export const $add = <VALUE>(value: VALUE): ADD<VALUE> => ({ [$HAS_VERB]: true, [$ADD]: value })

export const isAddUpdate = (input: unknown): input is { [$ADD]: unknown } =>
  isObject(input) && $ADD in input

export const $delete = <VALUE>(value: VALUE): DELETE<VALUE> => ({
  [$HAS_VERB]: true,
  [$DELETE]: value
})

export const isDeleteUpdate = (input: unknown): input is { [$DELETE]: unknown } =>
  isObject(input) && $DELETE in input

export const $append = <VALUE>(value: VALUE): APPEND<VALUE> => ({
  [$HAS_VERB]: true,
  [$APPEND]: value
})

export const isAppendUpdate = (input: unknown): input is { [$APPEND]: unknown } =>
  isObject(input) && $APPEND in input

export const $prepend = <VALUE>(value: VALUE): PREPEND<VALUE> => ({
  [$HAS_VERB]: true,
  [$PREPEND]: value
})

export const isPrependUpdate = (input: unknown): input is { [$PREPEND]: unknown } =>
  isObject(input) && $PREPEND in input
