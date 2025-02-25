import type { Attribute, AttributeBasicValue } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { ExtensionParser, ExtensionParserOptions } from '~/schema/index.js'

import { isGetting, isRemoval } from '../../symbols/index.js'
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

  if (isRemoval(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const { path, state } = attribute
        const { required } = state

        if (required !== 'never') {
          throw new DynamoDBToolboxError('parsing.attributeRequired', {
            message: `Attribute ${
              path !== undefined ? `'${path}' ` : ''
            }is required and cannot be removed`,
            path
          })
        }

        const parsedValue = input
        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = input
        return transformedValue
      }
    }
  }

  if (isGetting(input)) {
    return parseReferenceExtension(attribute, input, options)
  }

  switch (attribute.type) {
    case 'number':
      return parseNumberExtension(attribute, input, options)
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
