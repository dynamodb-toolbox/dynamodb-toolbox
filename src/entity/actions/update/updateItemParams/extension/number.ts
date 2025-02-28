import { DynamoDBToolboxError } from '~/errors/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { SchemaBasicValue } from '~/schema/index.js'
import type { ExtensionParser, ExtensionParserOptions } from '~/schema/index.js'
import { NumberSchema } from '~/schema/number/schema.js'
import { isArray } from '~/utils/validation/isArray.js'

import { $ADD, $SUBTRACT, $SUM, isAddition, isSubtraction, isSum } from '../../symbols/index.js'
import type { UpdateItemInputExtension } from '../../types.js'
import { parseReferenceExtension } from './reference.js'

export const parseNumberExtension = (
  schema: NumberSchema,
  inputValue: unknown,
  { transform = true, valuePath = [] }: ExtensionParserOptions = {}
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const { props } = schema

  if (isSum(inputValue) && inputValue[$SUM] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const sumElements = inputValue[$SUM]
        const sumValuePath = [...valuePath, '$SUM']

        if (!isArray(sumElements) || sumElements.length !== 2) {
          const path = formatValuePath(sumValuePath)

          throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
            message: `Sum for number attribute ${
              path !== undefined ? `'${path}' ` : ''
            }should be a tuple of length 2`,
            path,
            payload: { received: inputValue[$SUM] }
          })
        }

        const [left, right] = sumElements

        const parsers = [
          new Parser(new NumberSchema({ big: props.big })).start(left, {
            fill: false,
            transform,
            parseExtension: parseReferenceExtension,
            valuePath: [...sumValuePath, 0]
          }),
          new Parser(new NumberSchema({ big: props.big })).start(right, {
            fill: false,
            transform,
            parseExtension: parseReferenceExtension,
            valuePath: [...sumValuePath, 1]
          })
        ]

        const parsedValue = { [$SUM]: parsers.map(parser => parser.next().value) }
        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = { [$SUM]: parsers.map(parser => parser.next().value) }
        return transformedValue
      }
    }
  }

  if (isSubtraction(inputValue) && inputValue[$SUBTRACT] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const subtractElements = inputValue[$SUBTRACT]
        const subtractValuePath = [...valuePath, '$SUBTRACT']

        if (!isArray(subtractElements) || subtractElements.length !== 2) {
          const path = formatValuePath(subtractValuePath)

          throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
            message: `Subtraction for number attribute ${
              path !== undefined ? `'${path}' ` : ''
            }should be a tuple of length 2`,
            path,
            payload: {
              received: inputValue[$SUBTRACT]
            }
          })
        }

        const [left, right] = subtractElements
        const parsers = [
          new Parser(new NumberSchema({ big: props.big })).start(left, {
            fill: false,
            transform,
            parseExtension: parseReferenceExtension,
            valuePath: [...subtractValuePath, 0]
          }),
          new Parser(new NumberSchema({ big: props.big })).start(right, {
            fill: false,
            transform,
            parseExtension: parseReferenceExtension,
            valuePath: [...subtractValuePath, 1]
          })
        ]

        const parsedValue = { [$SUBTRACT]: parsers.map(parser => parser.next().value) }

        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = { [$SUBTRACT]: parsers.map(parser => parser.next().value) }
        return transformedValue
      }
    }
  }

  if (isAddition(inputValue) && inputValue[$ADD] !== undefined) {
    const parser = new Parser(new NumberSchema({ big: props.big })).start(inputValue[$ADD], {
      fill: false,
      transform,
      parseExtension: parseReferenceExtension,
      valuePath: [...valuePath, '$ADD']
    })

    return {
      isExtension: true,
      *extensionParser() {
        const parsedValue = { [$ADD]: parser.next().value }

        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = { [$ADD]: parser.next().value }
        return transformedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: inputValue as SchemaBasicValue<UpdateItemInputExtension> | undefined
  }
}
