import type { Attribute, AttributeBasicValue } from 'v1/schema/attributes'
import type { ReferenceExtension } from 'v1/operations/types'
import type { ExtensionParser, ExtensionParserOptions } from 'v1/schema/actions/parse/types'
import { isArray } from 'v1/utils/validation/isArray'
import { Parser } from 'v1/schema/actions/parse'
import { DynamoDBToolboxError } from 'v1/errors'

import type { UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $GET } from 'v1/operations/updateItem/constants'
import { hasGetOperation } from 'v1/operations/updateItem/utils'
import { isString } from 'v1/utils/validation'

export const parseReferenceExtension: ExtensionParser<
  ReferenceExtension,
  UpdateItemInputExtension
> = (
  attribute: Attribute,
  inputValue: unknown,
  { transform = true }: ExtensionParserOptions = {}
) => {
  if (hasGetOperation(inputValue) && inputValue[$GET] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const references = inputValue[$GET]

        if (!isArray(references)) {
          const { path } = attribute

          throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
            message: `References ${
              path !== undefined ? `for attribute '${path}' ` : ''
            }should be a tuple of one or two elements`,
            path,
            payload: {
              received: inputValue[$GET]
            }
          })
        }

        const [reference, fallback] = references

        if (!isString(reference)) {
          const { path } = attribute

          throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
            message: `First elements of references ${
              path !== undefined ? `for attribute '${path}' ` : ''
            }should be strings`,
            path,
            payload: {
              received: references[0]
            }
          })
        }

        const fallbackParser =
          fallback !== undefined
            ? new Parser(attribute).start(fallback, {
                fill: false,
                transform,
                parseExtension: parseReferenceExtension
              })
            : undefined

        const parsedValue = {
          [$GET]: [
            // NOTE: Reference validation will be done in UpdateExpressionParser
            reference,
            ...(fallbackParser !== undefined ? [fallbackParser.next().value] : [])
          ]
        }
        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = {
          [$GET]: [
            // NOTE: Reference validation will be done in UpdateExpressionParser
            reference,
            ...(fallbackParser !== undefined ? [fallbackParser.next().value] : [])
          ]
        }
        return transformedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: inputValue as AttributeBasicValue<ReferenceExtension> | undefined
  }
}
