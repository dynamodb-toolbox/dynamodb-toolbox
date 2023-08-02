import type { AttributeValue } from 'v1/schema'
import type { ExtensionCloner } from 'v1/validation/cloneInputAndAddDefaults/types'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults/attribute'
import { isObject } from 'v1/utils/validation/isObject'

import type { UpdateItemInputExtension } from '../../types'
import { $add, $delete, $remove, $set } from '../../constants'

import { hasAddOperation, hasDeleteOperation, hasSetOperation } from './utils'

export const cloneExtension: ExtensionCloner<UpdateItemInputExtension> = (
  attribute,
  input,
  options
) => {
  if (input === $remove) {
    return {
      isExtension: true,
      clonedExtension: $remove
    }
  }

  const hasAdd = hasAddOperation(input)
  const hasDelete = hasDeleteOperation(input)

  if (hasAdd || hasDelete) {
    const clonedExtension: AttributeValue<UpdateItemInputExtension> = {}

    if (hasAdd) {
      Object.assign(clonedExtension, {
        [$add]: cloneAttributeInputAndAddDefaults(attribute, input[$add], options)
      })
    }

    if (hasDelete) {
      Object.assign(clonedExtension, {
        [$delete]: cloneAttributeInputAndAddDefaults(attribute, input[$delete], options)
      })
    }

    return {
      isExtension: true,
      clonedExtension
    }
  }

  if (attribute.type === 'list' && isObject(input)) {
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

    return {
      isExtension: true,
      clonedExtension
    }
  }

  if ((attribute.type === 'map' || attribute.type === 'record') && hasSetOperation(input)) {
    return {
      isExtension: true,
      clonedExtension: {
        [$set]: cloneAttributeInputAndAddDefaults(attribute, input[$set], options)
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input
  }
}
