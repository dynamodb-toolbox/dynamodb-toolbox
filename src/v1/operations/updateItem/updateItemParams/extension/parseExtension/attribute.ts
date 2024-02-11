import type { ExtensionParser } from 'v1/parser/types'
import type { PrimitiveAttribute } from 'v1/schema'
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
  attribute,
  input,
  options
) => {
  const { fill = true } = options
  // We cast as boolean as we don't want to fill any default/link while parsing update extensions
  const nextOpts = { ...options, fill: Boolean(fill) }

  if (input === $REMOVE) {
    return {
      isExtension: true,
      *extensionParser() {
        if (fill) {
          const defaultedValue: typeof $REMOVE = $REMOVE
          yield defaultedValue

          const linkedValue: typeof $REMOVE = $REMOVE
          yield linkedValue
        }

        if (attribute.required !== 'never') {
          throw new DynamoDBToolboxError('parsing.attributeRequired', {
            message: `Attribute ${attribute.path} is required and cannot be removed`,
            path: attribute.path
          })
        }

        const parsedValue: typeof $REMOVE = $REMOVE
        yield parsedValue

        const transformedValue: typeof $REMOVE = $REMOVE
        return transformedValue
      }
    }
  }

  /**
   * @debt refactor "Maybe we can simply parse a super-extension here, and continue if is(Super)Extension is false. Would be neat."
   */
  if (hasGetOperation(input)) {
    return parseReferenceExtension(attribute, input, {
      ...nextOpts,
      // Can be a reference
      parseExtension: parseReferenceExtension
    })
  }

  switch (attribute.type) {
    case 'number':
      /**
       * @debt type "fix this cast"
       */
      return parseNumberExtension(attribute as PrimitiveAttribute<'number'>, input, nextOpts)
    case 'set':
      return parseSetExtension(attribute, input, nextOpts)
    case 'list':
      return parseListExtension(attribute, input, nextOpts)
    case 'map':
      return parseMapExtension(attribute, input, nextOpts)
    case 'record':
      return parseRecordExtension(attribute, input, nextOpts)
    default:
      return { isExtension: false, basicInput: input }
  }
}
