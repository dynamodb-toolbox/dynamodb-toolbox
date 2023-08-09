import cloneDeep from 'lodash.clonedeep'

import type { AttributeBasicValue, AttributeValue, PrimitiveAttribute } from 'v1/schema'
import type {
  AttributeCloningOptions,
  ExtensionCloner
} from 'v1/validation/cloneInputAndAddDefaults/types'
import type { ReferenceExtension, UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults/attribute'
import { $SUM, $SUBTRACT, $ADD } from 'v1/commands/updateItem/constants'
import { isArray } from 'v1/utils/validation/isArray'

import { hasSumOperation, hasSubtractOperation, hasAddOperation } from '../utils'

export const cloneNumberExtension = (
  attribute: PrimitiveAttribute<'number'>,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: AttributeCloningOptions<UpdateItemInputExtension>
): ReturnType<ExtensionCloner<UpdateItemInputExtension>> => {
  if (hasSumOperation(input)) {
    const clonedExtension: AttributeValue<UpdateItemInputExtension> = {}

    Object.assign(clonedExtension, {
      [$SUM]: isArray(input[$SUM])
        ? input[$SUM]
            .slice(0, 2)
            .map(element => cloneAttributeInputAndAddDefaults(attribute, element, options))
        : cloneDeep(input[$SUM])
    })

    return {
      isExtension: true,
      clonedExtension
    }
  }

  if (hasSubtractOperation(input)) {
    const clonedExtension: AttributeValue<UpdateItemInputExtension> = {}

    Object.assign(clonedExtension, {
      [$SUBTRACT]: isArray(input[$SUBTRACT])
        ? input[$SUBTRACT]
            .slice(0, 2)
            .map(element => cloneAttributeInputAndAddDefaults(attribute, element, options))
        : cloneDeep(input[$SUBTRACT])
    })

    return {
      isExtension: true,
      clonedExtension
    }
  }

  if (hasAddOperation<ReferenceExtension>(input)) {
    const clonedExtension: AttributeValue<UpdateItemInputExtension> = {}

    Object.assign(clonedExtension, {
      [$ADD]: cloneAttributeInputAndAddDefaults(attribute, input[$ADD], options)
    })

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
