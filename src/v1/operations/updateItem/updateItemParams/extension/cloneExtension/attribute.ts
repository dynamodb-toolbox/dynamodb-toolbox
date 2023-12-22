import type { PrimitiveAttribute } from 'v1/schema'
import type { ExtensionCloner } from 'v1/validation/cloneInputAndAddDefaults/types'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults/attribute'

import type { UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $SET, $REMOVE } from 'v1/operations/updateItem/constants'
import { hasSetOperation, hasGetOperation } from 'v1/operations/updateItem/utils'

import { cloneSetExtension } from './set'
import { cloneListExtension } from './list'
import { cloneNumberExtension } from './number'
import { cloneReferenceExtension } from './reference'

export const cloneUpdateExtension: ExtensionCloner<UpdateItemInputExtension> = (
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

  const hasGet = hasGetOperation(input)
  if (hasGet) {
    return cloneReferenceExtension(attribute, input, {
      ...options,
      cloneExtension: cloneReferenceExtension
    })
  }

  if (hasSetOperation(input)) {
    return {
      isExtension: true,
      clonedExtension: {
        [$SET]: cloneAttributeInputAndAddDefaults(attribute, input[$SET], options)
      }
    }
  }

  switch (attribute.type) {
    case 'number':
      /**
       * @debt type "fix this cast"
       */
      return cloneNumberExtension(attribute as PrimitiveAttribute<'number'>, input, options)
    case 'set':
      return cloneSetExtension(attribute, input, options)
    case 'list':
      return cloneListExtension(attribute, input, options)
    default:
      return { isExtension: false, basicInput: input }
  }
}
