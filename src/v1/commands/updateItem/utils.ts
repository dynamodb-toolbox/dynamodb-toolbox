import type { Attribute, AttributeValue } from 'v1/schema'
import { isObject } from 'v1/utils/validation/isObject'

import type {
  SET,
  GET,
  SUM,
  SUBTRACT,
  ADD,
  DELETE,
  APPEND,
  PREPEND,
  Reference,
  UpdateItemInputExtension
} from './types'
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

export const hasSetOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is {
  [$SET]: Extract<AttributeValue<UpdateItemInputExtension>, { [$SET]: unknown }>[$SET]
} => isObject(input) && $SET in input

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

export const hasGetOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is {
  [$GET]: Extract<AttributeValue<UpdateItemInputExtension>, { [$GET]: unknown }>[$GET]
} => isObject(input) && $GET in input

export const $remove = (): $REMOVE => $REMOVE

export const $sum = <A, B>(a: A, b: B): SUM<A, B> => ({ [$HAS_VERB]: true, [$SUM]: [a, b] })

export const hasSumOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is {
  [$SUM]: Extract<AttributeValue<UpdateItemInputExtension>, { [$SUM]: unknown }>[$SUM]
} => isObject(input) && $SUM in input

export const $subtract = <A, B>(a: A, b: B): SUBTRACT<A, B> => ({
  [$HAS_VERB]: true,
  [$SUBTRACT]: [a, b]
})

export const hasSubtractOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is {
  [$SUBTRACT]: Extract<
    AttributeValue<UpdateItemInputExtension>,
    { [$SUBTRACT]: unknown }
  >[$SUBTRACT]
} => isObject(input) && $SUBTRACT in input

export const $add = <VALUE>(value: VALUE): ADD<VALUE> => ({ [$HAS_VERB]: true, [$ADD]: value })

export const hasAddOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is {
  [$ADD]: Extract<AttributeValue<UpdateItemInputExtension>, { [$ADD]: unknown }>[$ADD]
} => isObject(input) && $ADD in input

export const $delete = <VALUE>(value: VALUE): DELETE<VALUE> => ({
  [$HAS_VERB]: true,
  [$DELETE]: value
})

export const hasDeleteOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is {
  [$DELETE]: Extract<AttributeValue<UpdateItemInputExtension>, { [$DELETE]: unknown }>[$DELETE]
} => isObject(input) && $DELETE in input

export const $append = <VALUE>(value: VALUE): APPEND<VALUE> => ({
  [$HAS_VERB]: true,
  [$APPEND]: value
})

export const hasAppendOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is {
  [$APPEND]: Extract<AttributeValue<UpdateItemInputExtension>, { [$APPEND]: unknown }>[$APPEND]
} => isObject(input) && $APPEND in input

export const $prepend = <VALUE>(value: VALUE): PREPEND<VALUE> => ({
  [$HAS_VERB]: true,
  [$PREPEND]: value
})

export const hasPrependOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is {
  [$PREPEND]: Extract<AttributeValue<UpdateItemInputExtension>, { [$PREPEND]: unknown }>[$PREPEND]
} => isObject(input) && $PREPEND in input
