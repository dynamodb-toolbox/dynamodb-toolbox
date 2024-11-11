import type { Attribute, AttributeBasicValue } from '~/attributes/index.js'
import { isGetting, isRemoval } from '~/entity/actions/update/symbols/index.js'
import { parseNumberExtension } from '~/entity/actions/update/updateItemParams/extension/number.js'
import { parseReferenceExtension } from '~/entity/actions/update/updateItemParams/extension/reference.js'
import { parseSetExtension } from '~/entity/actions/update/updateItemParams/extension/set.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { ExtensionParser, ExtensionParserOptions } from '~/schema/index.js'

import type { UpdateAttributesInputExtension } from '../../types.js'
import { parseListExtension } from './list.js'
import { parseMapExtension } from './map.js'
import { parseRecordExtension } from './record.js'

export const parseUpdateAttributesExtension: ExtensionParser<UpdateAttributesInputExtension> = (
  attribute: Attribute,
  input: unknown,
  options: ExtensionParserOptions = {}
) => {
  const { transform = true } = options

  if (isRemoval(input)) {
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
        basicInput: input as AttributeBasicValue<UpdateAttributesInputExtension> | undefined
      }
  }
}