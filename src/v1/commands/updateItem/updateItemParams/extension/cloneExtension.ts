import cloneDeep from 'lodash.clonedeep'

import type { AttributeValue } from 'v1/schema'
import type { ExtensionCloner } from 'v1/validation/cloneInputAndAddDefaults/types'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults/attribute'
import { isObject } from 'v1/utils/validation/isObject'
import { isArray } from 'v1/utils/validation/isArray'

import type { UpdateItemInputExtension } from '../../types'
import { $ADD, $DELETE, $REMOVE, $SET, $APPEND, $PREPEND } from '../../constants'
import {
  hasAddOperation,
  hasDeleteOperation,
  hasSetOperation,
  hasAppendOperation,
  hasPrependOperation
} from './utils'

export const cloneExtension: ExtensionCloner<UpdateItemInputExtension> = (
  attribute,
  input,
  options
) => {
  if (input === $REMOVE) {
    return {
      isExtension: true,
      clonedExtension: $REMOVE
    }
  }

  const hasAdd = hasAddOperation(input)
  const hasDelete = hasDeleteOperation(input)

  if (hasAdd || hasDelete) {
    const clonedExtension: AttributeValue<UpdateItemInputExtension> = {}

    if (hasAdd) {
      Object.assign(clonedExtension, {
        [$ADD]: cloneAttributeInputAndAddDefaults(attribute, input[$ADD], options)
      })
    }

    if (hasDelete) {
      Object.assign(clonedExtension, {
        [$DELETE]: cloneAttributeInputAndAddDefaults(attribute, input[$DELETE], options)
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

    if (hasAppendOperation(input)) {
      Object.assign(clonedExtension, {
        [$APPEND]: isArray(input[$APPEND])
          ? input[$APPEND].map(element =>
              cloneAttributeInputAndAddDefaults(attribute.elements, element, options)
            )
          : cloneDeep(input[$APPEND])
      })
    }

    if (hasPrependOperation(input)) {
      Object.assign(clonedExtension, {
        [$PREPEND]: isArray(input[$PREPEND])
          ? input[$PREPEND].map(element =>
              cloneAttributeInputAndAddDefaults(attribute.elements, element, options)
            )
          : cloneDeep(input[$PREPEND])
      })
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
        [$SET]: cloneAttributeInputAndAddDefaults(attribute, input[$SET], options)
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input
  }
}
