import type { AttributeValue } from 'v1/schema'
import type { ExtensionCloner } from 'v1/validation/cloneInputAndAddDefaults/types'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults/attribute'

import type { UpdateItemInputExtension } from '../../types'
import { $add, $delete, $remove } from '../../constants'

import { hasAddOperation, hasDeleteOperation } from './utils'

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

  return {
    isExtension: false,
    basicInput: input
  }
}
