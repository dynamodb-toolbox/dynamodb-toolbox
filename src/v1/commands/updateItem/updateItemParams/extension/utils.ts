import type { AttributeValue, Extension } from 'v1/schema'
import { isObject } from 'v1/utils/validation'

import type { ReferenceExtension, UpdateItemInputExtension } from '../../types'
import { $SET, $GET, $SUM, $SUBTRACT, $ADD, $DELETE, $APPEND, $PREPEND } from '../../constants'

export const hasSetOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$SET]: AttributeValue } => isObject(input) && $SET in input

export const hasGetOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$GET]: AttributeValue<ReferenceExtension> } => isObject(input) && $GET in input

export const hasSumOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$SUM]: [AttributeValue<ReferenceExtension>, AttributeValue<ReferenceExtension>] } =>
  isObject(input) && $SUM in input

export const hasSubtractOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is {
  [$SUBTRACT]: [AttributeValue<ReferenceExtension>, AttributeValue<ReferenceExtension>]
} => isObject(input) && $SUBTRACT in input

// Generic needed for divergence between number and set ADDs
export const hasAddOperation = <EXTENSION extends Extension = never>(
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$ADD]: AttributeValue<EXTENSION> } => isObject(input) && $ADD in input

export const hasDeleteOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$DELETE]: AttributeValue } => isObject(input) && $DELETE in input

export const hasAppendOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$APPEND]: AttributeValue<ReferenceExtension> } => isObject(input) && $APPEND in input

export const hasPrependOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$PREPEND]: AttributeValue<ReferenceExtension> } =>
  isObject(input) && $PREPEND in input
