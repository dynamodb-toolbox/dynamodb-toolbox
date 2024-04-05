import type { Attribute, AttributeBasicValue } from 'v1/schema/attributes'
import { Parser, ExtensionParser, ExtensionParserOptions } from 'v1/schema/actions/parse'
import { DynamoDBToolboxError } from 'v1/errors'
import { isArray } from 'v1/utils/validation/isArray'
import { isString } from 'v1/utils/validation/isString'

import type { UpdateItemInputExtension, ReferenceExtension } from '../../../types'
import { $GET } from '../../../constants'
import { isReferenceUpdate } from '../../../utils'

export const parseReferenceExtension: ExtensionParser<
  ReferenceExtension,
  UpdateItemInputExtension
> = (
  attribute: Attribute,
  inputValue: unknown,
  { transform = true }: ExtensionParserOptions = {}
) => {
  if (isReferenceUpdate(inputValue) && inputValue[$GET] !== undefined) {
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
