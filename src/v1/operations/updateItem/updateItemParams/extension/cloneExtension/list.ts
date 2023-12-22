import type { AttributeBasicValue, AttributeValue, ListAttribute } from 'v1/schema'
import type {
  AttributeCloningOptions,
  ExtensionCloner
} from 'v1/validation/cloneInputAndAddDefaults/types'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults/attribute'
import { isObject } from 'v1/utils/validation/isObject'

import type { UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $APPEND, $PREPEND } from 'v1/operations/updateItem/constants'
import { hasAppendOperation, hasPrependOperation } from 'v1/operations/updateItem/utils'

export const cloneListExtension = (
  attribute: ListAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: AttributeCloningOptions<UpdateItemInputExtension>
): ReturnType<ExtensionCloner<UpdateItemInputExtension>> => {
  if (isObject(input)) {
    const clonedExtension: Record<string, AttributeValue<UpdateItemInputExtension>> = {}

    for (const [inputKey, inputValue] of Object.entries(input)) {
      const clonedAttributeValue = cloneAttributeInputAndAddDefaults(
        attribute.elements,
        inputValue,
        options
      )

      if (clonedAttributeValue !== undefined) {
        clonedExtension[inputKey] = clonedAttributeValue
      }
    }

    if (hasAppendOperation(input)) {
      Object.assign(clonedExtension, {
        [$APPEND]: cloneAttributeInputAndAddDefaults(attribute, input[$APPEND], options)
      })
    }

    if (hasPrependOperation(input)) {
      Object.assign(clonedExtension, {
        [$PREPEND]: cloneAttributeInputAndAddDefaults(attribute, input[$PREPEND], options)
      })
    }

    return {
      isExtension: true,
      clonedExtension
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
