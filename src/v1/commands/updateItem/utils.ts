import type { Attribute, AttributeValue, Extension } from 'v1/schema'
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
  ReferenceExtension,
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
): input is { [$SET]: unknown } => isObject(input) && $SET in input

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

export const hasGetOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$GET]: unknown } => isObject(input) && $GET in input

export const $remove = (): $REMOVE => $REMOVE

export const $sum = <A, B>(a: A, b: B): SUM<A, B> => ({ [$HAS_VERB]: true, [$SUM]: [a, b] })

export const hasSumOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$SUM]: [AttributeValue<ReferenceExtension>, AttributeValue<ReferenceExtension>] } =>
  isObject(input) && $SUM in input

export const $subtract = <A, B>(a: A, b: B): SUBTRACT<A, B> => ({
  [$HAS_VERB]: true,
  [$SUBTRACT]: [a, b]
})

export const hasSubtractOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is {
  [$SUBTRACT]: [AttributeValue<ReferenceExtension>, AttributeValue<ReferenceExtension>]
} => isObject(input) && $SUBTRACT in input

export const $add = <VALUE>(value: VALUE): ADD<VALUE> => ({ [$HAS_VERB]: true, [$ADD]: value })

// Generic needed for divergence between number and set ADDs
export const hasAddOperation = <EXTENSION extends Extension = never>(
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$ADD]: AttributeValue<EXTENSION> } => isObject(input) && $ADD in input

export const $delete = <VALUE>(value: VALUE): DELETE<VALUE> => ({
  [$HAS_VERB]: true,
  [$DELETE]: value
})

export const hasDeleteOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$DELETE]: AttributeValue } => isObject(input) && $DELETE in input

export const $append = <VALUE>(value: VALUE): APPEND<VALUE> => ({
  [$HAS_VERB]: true,
  [$APPEND]: value
})

export const hasAppendOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$APPEND]: AttributeValue<ReferenceExtension> } => isObject(input) && $APPEND in input

export const $prepend = <VALUE>(value: VALUE): PREPEND<VALUE> => ({
  [$HAS_VERB]: true,
  [$PREPEND]: value
})

export const hasPrependOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$PREPEND]: AttributeValue<ReferenceExtension> } =>
  isObject(input) && $PREPEND in input
