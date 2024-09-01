import type { Attribute, AttributeBasicValue, PrimitiveAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { ExtensionParser, ExtensionParserOptions } from '~/schema/actions/parse/index.js'

import { $REMOVE, isGetting } from '../../symbols/index.js'
import type { UpdateItemInputExtension } from '../../types.js'
import { parseListExtension } from './list.js'
import { parseMapExtension } from './map.js'
import { parseNumberExtension } from './number.js'
import { parseRecordExtension } from './record.js'
import { parseReferenceExtension } from './reference.js'
import { parseSetExtension } from './set.js'

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

  if (isGetting(input)) {
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
