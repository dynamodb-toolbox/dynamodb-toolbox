import { DynamoDBToolboxError } from '~/errors/index.js'
import type {
  ExtensionParser,
  ExtensionParserOptions,
  ParsedValue
} from '~/schema/actions/parse/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { Attribute, AttributeBasicValue, ListAttribute } from '~/schema/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import { isArray } from '~/utils/validation/isArray.js'
import { isInteger } from '~/utils/validation/isInteger.js'
import { isObject } from '~/utils/validation/isObject.js'

import { $APPEND, $PREPEND, $REMOVE, $SET } from '../../constants.js'
import type { UpdateItemInputExtension } from '../../types.js'
import { isAppendUpdate, isPrependUpdate, isSetUpdate } from '../../utils.js'
import { parseUpdateExtension } from './attribute.js'
import { parseReferenceExtension } from './reference.js'

function* listElementParser(
  attribute: ListAttribute,
  inputValue: unknown,
  { transform = true }: ExtensionParserOptions
): Generator<
  ParsedValue<Attribute, { extension: UpdateItemInputExtension }> | undefined,
  ParsedValue<Attribute, { extension: UpdateItemInputExtension }> | undefined,
  ParsedValue<Schema, { extension: UpdateItemInputExtension }> | undefined
> {
  if (inputValue === $REMOVE) {
    const parsedValue: typeof $REMOVE = $REMOVE
    if (transform) {
      yield parsedValue
    } else {
      return parsedValue
    }

    const transformedValue: typeof $REMOVE = $REMOVE
    return transformedValue
  }

  if (inputValue === undefined) {
    const parsedValue = undefined
    if (transform) {
      yield parsedValue
    } else {
      return parsedValue
    }

    const transformedValue = undefined
    return transformedValue
  }

  return yield* new Parser(attribute.elements).start(inputValue, {
    mode: 'update',
    fill: false,
    transform,
    parseExtension: parseUpdateExtension
  })
}

export const parseListExtension = (
  attribute: ListAttribute,
  input: unknown,
  options: ExtensionParserOptions
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const { transform = true } = options

  if (isSetUpdate(input) && input[$SET] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = new Parser(attribute).start(input[$SET], { fill: false, transform })

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

  if (isObject(input) || isArray(input)) {
    if (isAppendUpdate(input) && input[$APPEND] !== undefined) {
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

    if (isPrependUpdate(input) && input[$PREPEND] !== undefined) {
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

    return {
      isExtension: true,
      *extensionParser() {
        let maxUpdatedIndex = 0
        const parsers: {
          [KEY in number]: Generator<
            ParsedValue<Attribute, { extension: UpdateItemInputExtension }>,
            ParsedValue<Attribute, { extension: UpdateItemInputExtension }>,
            ParsedValue<Schema, { extension: UpdateItemInputExtension }> | undefined
          >
        } = Object.fromEntries(
          Object.entries(input).map(([index, element]) => [
            index,
            listElementParser(attribute, element, options)
          ])
        )

        for (const inputKey of Object.keys(parsers)) {
          const parsedInputKey = parseFloat(inputKey)

          if (!isInteger(parsedInputKey)) {
            const { path } = attribute

            throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
              message: `Index of array attribute ${
                path !== undefined ? `'${path}' ` : ''
              }is not a valid integer`,
              path,
              payload: {
                received: inputKey
              }
            })
          }

          maxUpdatedIndex = Math.max(maxUpdatedIndex, parsedInputKey)
        }

        const parsedValue = Object.fromEntries(
          Object.entries(parsers)
            .map(([index, parser]) => [index, parser.next().value])
            .filter(([, element]) => element !== undefined)
        )
        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = [...Array(maxUpdatedIndex + 1).keys()].map(index => {
          const parser = parsers[index]

          return parser === undefined ? undefined : parser.next().value
        })
        return transformedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
