import type { AttributeValue } from 'v1/schema'
import { isObject } from 'v1/utils/validation'

import type { UpdateItemInputExtension } from '../../types'
import { $set, $add, $delete } from '../../constants'

export const hasSetOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$set]: AttributeValue } => isObject(input) && $set in input

export const hasAddOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$add]: AttributeValue<UpdateItemInputExtension> } => isObject(input) && $add in input

export const hasDeleteOperation = (
  input: AttributeValue<UpdateItemInputExtension> | undefined
): input is { [$delete]: AttributeValue<UpdateItemInputExtension> } =>
  isObject(input) && $delete in input
