import type { AttributeValue } from 'v1/schema'
import { isObject } from 'v1/utils/validation'

import type { UpdateItemInputExtension } from '../../types'
import { $SET, $GET, $ADD, $DELETE, $APPEND, $PREPEND } from '../../constants'

export const hasSetOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$SET]: AttributeValue } => isObject(input) && $SET in input

export const hasGetOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$GET]: AttributeValue } => isObject(input) && $GET in input

export const hasAddOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$ADD]: AttributeValue<UpdateItemInputExtension> } => isObject(input) && $ADD in input

export const hasDeleteOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$DELETE]: AttributeValue<UpdateItemInputExtension> } =>
  isObject(input) && $DELETE in input

export const hasAppendOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$APPEND]: AttributeValue<UpdateItemInputExtension> } =>
  isObject(input) && $APPEND in input

export const hasPrependOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$PREPEND]: AttributeValue<UpdateItemInputExtension> } =>
  isObject(input) && $PREPEND in input
