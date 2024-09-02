import type { Attribute, AttributeBasicValue } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { ExtensionParser, ExtensionParserOptions } from '~/schema/actions/parse/index.js'
import { isArray } from '~/utils/validation/isArray.js'
import { isString } from '~/utils/validation/isString.js'

import { $GET, isGetting } from '../../symbols/index.js'
import type { ReferenceExtension, UpdateItemInputExtension } from '../../types.js'

export const parseReferenceExtension: ExtensionParser<
  ReferenceExtension,
  UpdateItemInputExtension
> = (
  attribute: Attribute,
  inputValue: unknown,
  { transform = true }: ExtensionParserOptions = {}
) => {
  if (isGetting(inputValue) && inputValue[$GET] !== undefined) {
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
            // NOTE: Reference validation is done in UpdateExpressionParser
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
            // NOTE: Reference validation is done in UpdateExpressionParser
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
