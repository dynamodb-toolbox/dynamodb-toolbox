import type { AttributeBasicValue, PrimitiveAttribute } from '~/attributes/index.js'
import { number } from '~/attributes/number/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { ExtensionParser, ExtensionParserOptions } from '~/schema/actions/parse/index.js'
import { isArray } from '~/utils/validation/isArray.js'

import { $ADD, $SUBTRACT, $SUM, isAddition, isSubtraction, isSum } from '../../symbols/index.js'
import type { UpdateItemInputExtension } from '../../types.js'
import { parseReferenceExtension } from './reference.js'

export const parseNumberExtension = (
  attribute: PrimitiveAttribute<'number'>,
  inputValue: unknown,
  { transform = true }: ExtensionParserOptions = {}
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (isSum(inputValue) && inputValue[$SUM] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const sumElements = inputValue[$SUM]

        if (!isArray(sumElements) || sumElements.length !== 2) {
          const { path } = attribute

          throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
            message: `Sum for number attribute ${
              path !== undefined ? `'${path}' ` : ''
            }should be a tuple of length 2`,
            path,
            payload: {
              received: inputValue[$SUM]
            }
          })
        }

        const [left, right] = sumElements
        const parsers = [
          new Parser(number().freeze(`${attribute.path}[$SUM][0]`)).start(left, {
            fill: false,
            transform,
            parseExtension: parseReferenceExtension
          }),
          new Parser(number().freeze(`${attribute.path}[$SUM][1]`)).start(right, {
            fill: false,
            transform,
            parseExtension: parseReferenceExtension
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

        if (!isArray(subtractElements) || subtractElements.length !== 2) {
          const { path } = attribute

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
          new Parser(number().freeze(`${attribute.path}[$SUBTRACT][0]`)).start(left, {
            fill: false,
            transform,
            parseExtension: parseReferenceExtension
          }),
          new Parser(number().freeze(`${attribute.path}[$SUBTRACT][1]`)).start(right, {
            fill: false,
            transform,
            parseExtension: parseReferenceExtension
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
    const parser = new Parser(number().freeze(`${attribute.path}[$ADD]`)).start(inputValue[$ADD], {
      fill: false,
      transform,
      parseExtension: parseReferenceExtension
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
    basicInput: inputValue as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
