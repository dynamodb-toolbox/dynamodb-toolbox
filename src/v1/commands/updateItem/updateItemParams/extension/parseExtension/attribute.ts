import type { ExtensionParser } from 'v1/validation/parseClonedInput/types'
import type { PrimitiveAttribute } from 'v1/schema'
import type { UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { DynamoDBToolboxError } from 'v1/errors'
import { $GET, $REMOVE } from 'v1/commands/updateItem/constants'

import { hasGetOperation } from '../utils'
import { parseNumberExtension } from './number'
import { parseSetExtension } from './set'
import { parseListExtension } from './list'
import { parseMapExtension } from './map'
import { parseRecordExtension } from './record'

export const parseExtension: ExtensionParser<UpdateItemInputExtension> = (
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

  const hasGet = hasGetOperation(input)
  if (hasGet) {
    return {
      isExtension: true,
      // NOTE: Validation will be done in UpdateExpressionParser
      parsedExtension: { [$GET]: input[$GET] }
    }
  }

  switch (attribute.type) {
    case 'number':
      /**
       * @debt type "fix this cast"
       */
      return parseNumberExtension(attribute as PrimitiveAttribute<'number'>, input, options)
    case 'set':
      return parseSetExtension(attribute, input, options)
    case 'list':
      return parseListExtension(attribute, input, options)
    case 'map':
      return parseMapExtension(attribute, input, options)
    case 'record':
      return parseRecordExtension(attribute, input, options)
    default:
      return { isExtension: false, basicInput: input }
  }
}
