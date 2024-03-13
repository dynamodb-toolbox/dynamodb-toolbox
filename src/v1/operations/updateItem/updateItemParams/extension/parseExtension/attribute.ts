import type { ExtensionParser, ExtensionParserOptions } from 'v1/schema/actions/parse/types'
import type { PrimitiveAttribute, AttributeBasicValue, Attribute } from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'

import type { UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $REMOVE } from 'v1/operations/updateItem/constants'
import { hasGetOperation } from 'v1/operations/updateItem/utils'

import { parseNumberExtension } from './number'
import { parseSetExtension } from './set'
import { parseListExtension } from './list'
import { parseMapExtension } from './map'
import { parseRecordExtension } from './record'
import { parseReferenceExtension } from './reference'

export const parseUpdateExtension: ExtensionParser<UpdateItemInputExtension> = (
  attribute: Attribute,
  input: unknown,
  options: ExtensionParserOptions = {}
) => {
  const { transform = true } = options

  if (input === $REMOVE) {
    return {
      isExtension: true,
      *extensionParser() {
        const { path, required } = attribute

        if (required !== 'never') {
          throw new DynamoDBToolboxError('parsing.attributeRequired', {
            message: `Attribute ${
              path !== undefined ? `'${path}' ` : ''
            }is required and cannot be removed`,
            path
          })
        }

        const parsedValue: typeof $REMOVE = $REMOVE
        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue: typeof $REMOVE = $REMOVE
        return transformedValue
      }
    }
  }

  if (hasGetOperation(input)) {
    return parseReferenceExtension(attribute, input, options)
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
      return {
        isExtension: false,
        basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
      }
  }
}
