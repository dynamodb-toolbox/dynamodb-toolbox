import cloneDeep from 'lodash.clonedeep'

import type { PrimitiveAttribute } from 'v1/schema'
import type { ExtensionCloner } from 'v1/validation/cloneInputAndAddDefaults/types'
import type { UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults/attribute'
import { $SET, $GET, $REMOVE } from 'v1/commands/updateItem/constants'

import { hasSetOperation, hasGetOperation } from '../utils'
import { cloneSetExtension } from './set'
import { cloneListExtension } from './list'
import { cloneNumberExtension } from './number'

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

  const hasGet = hasGetOperation(input)
  if (hasGet) {
    return {
      isExtension: true,
      clonedExtension: { [$GET]: cloneDeep(input[$GET]) }
    }
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
