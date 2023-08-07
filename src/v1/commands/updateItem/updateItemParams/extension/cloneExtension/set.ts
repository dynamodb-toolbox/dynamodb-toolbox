import type { AttributeBasicValue, AttributeValue, SetAttribute } from 'v1/schema'
import type {
  AttributeCloningOptions,
  ExtensionCloner
} from 'v1/validation/cloneInputAndAddDefaults/types'
import type { UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults/attribute'
import { $ADD, $DELETE } from 'v1/commands/updateItem/constants'

import { hasAddOperation, hasDeleteOperation } from '../utils'

export const cloneSetExtension = (
  attribute: SetAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: AttributeCloningOptions<UpdateItemInputExtension>
): ReturnType<ExtensionCloner<UpdateItemInputExtension>> => {
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

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
