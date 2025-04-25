import {
  $APPEND,
  $PREPEND,
  $SET,
  isAppending,
  isPrepending
} from '~/entity/actions/update/symbols/index.js'
import { parseReferenceExtension } from '~/entity/actions/update/updateItemParams/extension/reference.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type {
  ExtensionParser,
  ExtensionParserOptions,
  ListSchema,
  SchemaUnextendedValue
} from '~/schema/index.js'
import { isArray } from '~/utils/validation/isArray.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { UpdateAttributesInputExtension } from '../../types.js'

export const parseListExtension = (
  schema: ListSchema,
  input: unknown,
  options: ExtensionParserOptions
): ReturnType<ExtensionParser<UpdateAttributesInputExtension>> => {
  const { transform = true, valuePath } = options

  if (isObject(input)) {
    if (isAppending(input) && input[$APPEND] !== undefined) {
      const appendedValue = input[$APPEND]
      const appendedValuePath = [...(valuePath ?? []), '$APPEND']

      if (isArray(appendedValue)) {
        return {
          isExtension: true,
          *extensionParser() {
            const parsers = appendedValue.map((element, index) =>
              // Should be a simple list of valid elements (not extended)
              new Parser(schema.elements).start(element, {
                fill: false,
                transform,
                valuePath: [...appendedValuePath, index]
              })
            )

            const parsedValue = { [$APPEND]: parsers.map(parser => parser.next().value) }
            if (transform) {
              yield parsedValue
            } else {
              return parsedValue
            }

            const transformedValue = { [$APPEND]: parsers.map(parser => parser.next().value) }
            return transformedValue
          }
        }
      }

      return {
        isExtension: true,
        *extensionParser() {
          const parser = new Parser(schema).start(appendedValue, {
            fill: false,
            transform,
            parseExtension: parseReferenceExtension,
            valuePath: appendedValuePath
          })

          const parsedValue = { [$APPEND]: parser.next().value }
          if (transform) {
            yield parsedValue
          } else {
            return parsedValue
          }

          const transformedValue = { [$APPEND]: parser.next().value }
          return transformedValue
        }
      }
    }

    if (isPrepending(input) && input[$PREPEND] !== undefined) {
      const prependedValue = input[$PREPEND]
      const prependedValuePath = [...(valuePath ?? []), '$PREPEND']

      if (isArray(prependedValue)) {
        return {
          isExtension: true,
          *extensionParser() {
            const parsers = prependedValue.map((element, index) =>
              // Should be a simple list of valid elements (not extended)
              new Parser(schema.elements).start(element, {
                fill: false,
                transform,
                valuePath: [...prependedValuePath, index]
              })
            )

            const parsedValue = { [$PREPEND]: parsers.map(parser => parser.next().value) }
            if (transform) {
              yield parsedValue
            } else {
              return parsedValue
            }

            const transformedValue = { [$PREPEND]: parsers.map(parser => parser.next().value) }
            return transformedValue
          }
        }
      }

      return {
        isExtension: true,
        *extensionParser() {
          const parser = new Parser(schema).start(prependedValue, {
            fill: false,
            transform,
            parseExtension: parseReferenceExtension,
            valuePath: prependedValuePath
          })

          const parsedValue = { [$PREPEND]: parser.next().value }
          if (transform) {
            yield parsedValue
          } else {
            return parsedValue
          }

          const transformedValue = { [$PREPEND]: parser.next().value }
          return transformedValue
        }
      }
    }
  }

  if (isArray(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = new Parser(schema).start(input, { fill: false, transform, valuePath })

        const parsedValue = { [$SET]: parser.next().value }
        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = { [$SET]: parser.next().value }
        return transformedValue
      }
    }
  }

  return {
    isExtension: false,
    unextendedInput: input as SchemaUnextendedValue<UpdateAttributesInputExtension> | undefined
  }
}
