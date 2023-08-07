import type { PrimitiveAttribute } from 'v1/schema'
import type { ExtensionCloner } from 'v1/validation/cloneInputAndAddDefaults/types'
import type { UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults/attribute'
import { $SET, $REMOVE } from 'v1/commands/updateItem/constants'

import { hasSetOperation, hasGetOperation } from '../utils'
import { cloneSetExtension } from './set'
import { cloneListExtension } from './list'
import { cloneNumberExtension } from './number'
import { cloneReferenceExtension } from './reference'

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

  /**
   * @debt refactor "Maybe we can simply clone a super-extension here, and continue if is(Super)Extension is false. Would be neat."
   */
  const hasGet = hasGetOperation(input)
  if (hasGet) {
    /**
     * @debt refactor "TODO: Improve types if super-extensions happen: It's possible that computeDefaultsContext carries larger extension than currently checked."
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { computeDefaultsContext: _, ...restOptions } = options

    return cloneReferenceExtension(attribute, input, {
      ...restOptions,
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
