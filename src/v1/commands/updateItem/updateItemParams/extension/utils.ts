import type { AttributeValue } from 'v1/schema'
import { isObject } from 'v1/utils/validation'

import type { UpdateItemInputExtension } from '../../types'
import { $SET, $ADD, $DELETE } from '../../constants'

export const hasSetOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$SET]: AttributeValue } => isObject(input) && $SET in input

export const hasAddOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$ADD]: AttributeValue<UpdateItemInputExtension> } => isObject(input) && $ADD in input

export const hasDeleteOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$DELETE]: AttributeValue<UpdateItemInputExtension> } =>
  isObject(input) && $DELETE in input
