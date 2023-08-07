import type { AttributeBasicValue, AttributeValue, PrimitiveAttribute } from 'v1/schema'
import type {
  AttributeCloningOptions,
  ExtensionCloner
} from 'v1/validation/cloneInputAndAddDefaults/types'
import type { UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults/attribute'
import { $ADD } from 'v1/commands/updateItem/constants'

import { hasAddOperation } from '../utils'

export const cloneNumberExtension = (
  attribute: PrimitiveAttribute<'number'>,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: AttributeCloningOptions<UpdateItemInputExtension>
): ReturnType<ExtensionCloner<UpdateItemInputExtension>> => {
  const hasAdd = hasAddOperation(input)

  if (hasAddOperation(input)) {
    const clonedExtension: AttributeValue<UpdateItemInputExtension> = {}

    if (hasAdd) {
      Object.assign(clonedExtension, {
        [$ADD]: cloneAttributeInputAndAddDefaults(attribute, input[$ADD], options)
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
