import type { AttributeBasicValue } from '~/attributes/index.js'
import { NumberSchema } from '~/attributes/number/schema.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { ExtensionParser, ExtensionParserOptions } from '~/schema/index.js'
import { isArray } from '~/utils/validation/isArray.js'

import { $ADD, $SUBTRACT, $SUM, isAddition, isSubtraction, isSum } from '../../symbols/index.js'
import type { UpdateItemInputExtension } from '../../types.js'
import { parseReferenceExtension } from './reference.js'

export const parseNumberExtension = (
  attribute: NumberSchema,
  inputValue: unknown,
  { transform = true }: ExtensionParserOptions = {}
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (isSum(inputValue) && inputValue[$SUM] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const sumElements = inputValue[$SUM]
        const { state } = attribute

        if (!isArray(sumElements) || sumElements.length !== 2) {
          const { path } = attribute

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
          new Parser(
            new NumberSchema({
              // TODO: Important to have path?
              path: `${attribute.path}[$SUM][0]`,
              big: state.big
            })
          ).start(left, { fill: false, transform, parseExtension: parseReferenceExtension }),
          new Parser(
            new NumberSchema({
              // TODO: Important to have path?
              path: `${attribute.path}[$SUM][1]`,
              big: state.big
            })
          ).start(right, { fill: false, transform, parseExtension: parseReferenceExtension })
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
        const { state } = attribute

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
          new Parser(
            new NumberSchema({
              // TODO: Important to keep path?
              path: `${attribute.path}[$SUBTRACT][0]`,
              big: state.big
            })
          ).start(left, { fill: false, transform, parseExtension: parseReferenceExtension }),
          new Parser(
            new NumberSchema({
              // TODO: Important to keep path?
              path: `${attribute.path}[$SUBTRACT][1]`,
              big: state.big
            })
          ).start(right, { fill: false, transform, parseExtension: parseReferenceExtension })
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
    const { state } = attribute
    const parser = new Parser(
      new NumberSchema({
        // TODO: Important to keep path?
        path: `${attribute.path}[$ADD]`,
        big: state.big
      })
    ).start(inputValue[$ADD], { fill: false, transform, parseExtension: parseReferenceExtension })

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
