import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { Schema, SchemaBasicValue } from '~/schema/index.js'
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
  schema: Schema,
  input: unknown,
  options: ExtensionParserOptions = {}
) => {
  const { transform = true, valuePath } = options

  if (isRemoval(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const { props } = schema
        const { required } = props
        const path = formatValuePath(valuePath)

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
    return parseReferenceExtension(schema, input, options)
  }

  switch (schema.type) {
    case 'number':
      return parseNumberExtension(schema, input, options)
    case 'set':
      return parseSetExtension(schema, input, options)
    case 'list':
      return parseListExtension(schema, input, options)
    case 'map':
      return parseMapExtension(schema, input, options)
    case 'record':
      return parseRecordExtension(schema, input, options)
    default:
      return {
        isExtension: false,
        basicInput: input as SchemaBasicValue<UpdateItemInputExtension> | undefined
      }
  }
}
