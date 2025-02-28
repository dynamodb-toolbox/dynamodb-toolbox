import { DynamoDBToolboxError } from '~/errors/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { Schema, SchemaBasicValue } from '~/schema/index.js'
import type { ExtensionParser, ExtensionParserOptions } from '~/schema/index.js'
import { isArray } from '~/utils/validation/isArray.js'
import { isString } from '~/utils/validation/isString.js'

import { $GET, isGetting } from '../../symbols/index.js'
import type { ReferenceExtension, UpdateItemInputExtension } from '../../types.js'

export const parseReferenceExtension: ExtensionParser<
  ReferenceExtension,
  UpdateItemInputExtension
> = (
  schema: Schema,
  inputValue: unknown,
  { transform = true, valuePath = [] }: ExtensionParserOptions = {}
) => {
  if (!isGetting(inputValue) || inputValue[$GET] === undefined) {
    return {
      isExtension: false,
      basicInput: inputValue as SchemaBasicValue<ReferenceExtension> | undefined
    }
  }

  return {
    isExtension: true,
    *extensionParser() {
      const references = inputValue[$GET]
      const referencesPath = [...valuePath, '$GET']

      if (!isArray(references)) {
        const path = formatValuePath(referencesPath)

        throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
          message: `References ${
            path !== undefined ? `for attribute '${path}' ` : ''
          }should be a tuple of one or two elements`,
          path,
          payload: { received: references }
        })
      }

      const [reference, fallback] = references

      if (!isString(reference)) {
        const path = formatValuePath([...referencesPath, 0])

        throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
          message: `First elements of references ${
            path !== undefined ? `for attribute '${path}' ` : ''
          }should be strings`,
          path,
          payload: { received: reference }
        })
      }

      const fallbackParser =
        fallback !== undefined
          ? new Parser(schema).start(fallback, {
              fill: false,
              transform,
              parseExtension: parseReferenceExtension,
              valuePath: [...referencesPath, 1]
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
