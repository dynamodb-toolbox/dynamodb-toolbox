import type { ListSchema, Schema, SchemaBasicValue } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { ExtensionParser, ExtensionParserOptions } from '~/schema/index.js'
import type { TransformedValue, ValidValue } from '~/schema/index.js'
import { isArray } from '~/utils/validation/isArray.js'
import { isInteger } from '~/utils/validation/isInteger.js'
import { isObject } from '~/utils/validation/isObject.js'

import {
  $APPEND,
  $PREPEND,
  $SET,
  isAppending,
  isPrepending,
  isRemoval,
  isSetting
} from '../../symbols/index.js'
import type { UpdateItemInputExtension } from '../../types.js'
import { parseUpdateExtension } from './attribute.js'
import { parseReferenceExtension } from './reference.js'

function* listElementParser(
  schema: ListSchema,
  inputValue: unknown,
  { transform = true, valuePath = [] }: ExtensionParserOptions
): Generator<
  ValidValue<Schema, { extension: UpdateItemInputExtension }> | undefined,
  | ValidValue<Schema, { extension: UpdateItemInputExtension }>
  | TransformedValue<Schema, { extension: UpdateItemInputExtension }>
> {
  if (isRemoval(inputValue)) {
    const parsedValue = inputValue
    if (transform) {
      yield parsedValue
    } else {
      return parsedValue
    }

    const transformedValue = parsedValue
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

  return yield* new Parser(schema.elements).start(inputValue, {
    mode: 'update',
    fill: false,
    transform,
    parseExtension: parseUpdateExtension,
    valuePath
  })
}

export const parseListExtension = (
  schema: ListSchema,
  input: unknown,
  { transform = true, valuePath = [] }: ExtensionParserOptions
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (isSetting(input) && input[$SET] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = new Parser(schema).start(input[$SET], {
          fill: false,
          transform,
          valuePath: [...valuePath, '$SET']
        })

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
    if (isAppending(input) && input[$APPEND] !== undefined) {
      const appendedValue = input[$APPEND]
      const appendedValuePath = [...valuePath, '$APPEND']

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
      const prependedValuePath = [...valuePath, '$PREPEND']

      if (isArray(prependedValue)) {
        return {
          isExtension: true,
          *extensionParser() {
            const parsers = prependedValue.map((element, index) =>
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

    return {
      isExtension: true,
      *extensionParser() {
        let maxUpdatedIndex = 0
        const parsers: {
          [KEY in number]: Generator<
            ValidValue<Schema, { extension: UpdateItemInputExtension }>,
            | ValidValue<Schema, { extension: UpdateItemInputExtension }>
            | TransformedValue<Schema, { extension: UpdateItemInputExtension }>
          >
        } = Object.fromEntries(
          Object.entries(input).map(([index, element]) => [
            index,
            listElementParser(schema, element, { transform, valuePath: [...valuePath, index] })
          ])
        )

        for (const inputKey of Object.keys(parsers)) {
          const parsedInputKey = parseFloat(inputKey)
          const path = formatValuePath(valuePath)

          if (!isInteger(parsedInputKey)) {
            throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
              message: `Index of array attribute ${
                path !== undefined ? `'${path}' ` : ''
              }is not a valid integer`,
              path,
              payload: { received: inputKey }
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
    basicInput: input as SchemaBasicValue<UpdateItemInputExtension> | undefined
  }
}
