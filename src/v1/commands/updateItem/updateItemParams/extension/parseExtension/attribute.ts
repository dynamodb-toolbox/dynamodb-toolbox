import type { ExtensionParser } from 'v1/validation/parseClonedInput/types'
import type { PrimitiveAttribute } from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'

import type { UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { $REMOVE } from 'v1/commands/updateItem/constants'
import { hasGetOperation } from 'v1/commands/updateItem/utils'

import { parseNumberExtension } from './number'
import { parseSetExtension } from './set'
import { parseListExtension } from './list'
import { parseMapExtension } from './map'
import { parseRecordExtension } from './record'
import { parseReferenceExtension } from './reference'

export const parseUpdateExtension: ExtensionParser<UpdateItemInputExtension> = (
  attribute,
  input,
  options
) => {
  if (input === $REMOVE) {
    if (attribute.required !== 'never') {
      throw new DynamoDBToolboxError('parsing.attributeRequired', {
        message: `Attribute ${attribute.path} is required and cannot be removed`,
        path: attribute.path
      })
    }

    return {
      isExtension: true,
      parsedExtension: $REMOVE
    }
  }

  /**
   * @debt refactor "Maybe we can simply parse a super-extension here, and continue if is(Super)Extension is false. Would be neat."
   */
  if (hasGetOperation(input)) {
    // Omit parseExtension & requiringOptions for non-extended values
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { parseExtension: _, requiringOptions: __, ...restOptions } = options

    return parseReferenceExtension(attribute, input, {
      ...restOptions,
      parseExtension: parseReferenceExtension
    })
  }

  switch (attribute.type) {
    case 'number':
      /**
       * @debt type "fix this cast"
       */
      return parseNumberExtension(attribute as PrimitiveAttribute<'number'>, input)
    case 'set':
      return parseSetExtension(attribute, input)
    case 'list':
      return parseListExtension(attribute, input, options)
    case 'map':
      return parseMapExtension(attribute, input)
    case 'record':
      return parseRecordExtension(attribute, input, options)
    default:
      return { isExtension: false, basicInput: input }
  }
}
