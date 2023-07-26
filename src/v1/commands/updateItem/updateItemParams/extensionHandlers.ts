import type { AttributeValue } from 'v1/schema'
import type { CloningExtensionHandler } from 'v1/validation/cloneInputAndAddDefaults/types'
import { isObject } from 'v1/utils/validation'

import { $add, $delete, $remove } from '../constants'
import type { UpdateItemInputExtension } from '../types'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'

const hasAddOperation = (
  input: AttributeValue<UpdateItemInputExtension>
): input is { [$add]: AttributeValue<UpdateItemInputExtension> } => isObject(input) && $add in input

const hasDeleteOperation = (
  input: AttributeValue<UpdateItemInputExtension>
): input is { [$delete]: AttributeValue<UpdateItemInputExtension> } =>
  isObject(input) && $delete in input

export const handleExtensionCloning: CloningExtensionHandler<UpdateItemInputExtension> = (
  attribute,
  input,
  options
) => {
  if (input === $remove) {
    return {
      isExtension: true,
      parsedExtension: input
    }
  }

  const hasAdd = hasAddOperation(input)
  const hasDelete = hasDeleteOperation(input)

  if (hasAdd || hasDelete) {
    const parsedExtension: AttributeValue<UpdateItemInputExtension> = {}

    if (hasAdd) {
      Object.assign(parsedExtension, {
        [$add]: cloneAttributeInputAndAddDefaults(attribute, input[$add], options)
      })
    }

    if (hasDelete) {
      Object.assign(parsedExtension, {
        [$delete]: cloneAttributeInputAndAddDefaults(attribute, input[$delete], options)
      })
    }

    return {
      isExtension: true,
      parsedExtension
    }
  }

  return {
    isExtension: false,
    basicInput: input
  }
}
