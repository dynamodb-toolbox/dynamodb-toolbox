import type { AttributeBasicValue, ListAttribute } from '~/attributes/index.js'
import {
  $APPEND,
  $PREPEND,
  $SET,
  isAppending,
  isPrepending
} from '~/entity/actions/update/symbols/index.js'
import { parseReferenceExtension } from '~/entity/actions/update/updateItemParams/extension/reference.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { ExtensionParser, ExtensionParserOptions } from '~/schema/index.js'
import { isArray } from '~/utils/validation/isArray.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { UpdateAttributesInputExtension } from '../../types.js'

export const parseListExtension = (
  attribute: ListAttribute,
  input: unknown,
  options: ExtensionParserOptions
): ReturnType<ExtensionParser<UpdateAttributesInputExtension>> => {
  const { transform = true } = options

  if (isObject(input)) {
    if (isAppending(input) && input[$APPEND] !== undefined) {
      const appendedValue = input[$APPEND]

      if (isArray(appendedValue)) {
        return {
          isExtension: true,
          *extensionParser() {
            const parsers = appendedValue.map(element =>
              // Should a simple list of valid elements (not extended)
              new Parser(attribute.elements).start(element, { fill: false, transform })
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
          const parser = new Parser(attribute).start(appendedValue, {
            fill: false,
            transform,
            parseExtension: parseReferenceExtension
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

      if (isArray(prependedValue)) {
        return {
          isExtension: true,
          *extensionParser() {
            const parsers = prependedValue.map(element =>
              new Parser(attribute.elements).start(element, { fill: false, transform })
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
          const parser = new Parser(attribute).start(prependedValue, {
            fill: false,
            transform,
            parseExtension: parseReferenceExtension
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
        const parser = new Parser(attribute).start(input, { fill: false, transform })

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
    basicInput: input as AttributeBasicValue<UpdateAttributesInputExtension> | undefined
  }
}
