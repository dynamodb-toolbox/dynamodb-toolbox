import type { PrimitiveAttribute, AttributeBasicValue } from 'v1/schema/attributes'
import { number } from 'v1/schema/attributes/primitive'
import { Parser, ExtensionParser, ExtensionParserOptions } from 'v1/schema/actions/parse'
import { isArray } from 'v1/utils/validation/isArray'
import { DynamoDBToolboxError } from 'v1/errors'

import type { UpdateItemInputExtension } from '../../../types'
import { $SUM, $SUBTRACT, $ADD } from '../../../constants'
import { isSumUpdate, isSubtractUpdate, isAddUpdate } from '../../../utils'

import { parseReferenceExtension } from './reference'

export const parseNumberExtension = (
  attribute: PrimitiveAttribute<'number'>,
  inputValue: unknown,
  { transform = true }: ExtensionParserOptions = {}
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (isSumUpdate(inputValue) && inputValue[$SUM] !== undefined) {
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
          number().freeze(`${attribute.path}[$SUM][0]`).build(Parser).start(left, {
            fill: false,
            transform,
            parseExtension: parseReferenceExtension
          }),
          number().freeze(`${attribute.path}[$SUM][1]`).build(Parser).start(right, {
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

  if (isSubtractUpdate(inputValue) && inputValue[$SUBTRACT] !== undefined) {
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
          number().freeze(`${attribute.path}[$SUBTRACT][0]`).build(Parser).start(left, {
            fill: false,
            transform,
            parseExtension: parseReferenceExtension
          }),
          number().freeze(`${attribute.path}[$SUBTRACT][1]`).build(Parser).start(right, {
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

  if (isAddUpdate(inputValue) && inputValue[$ADD] !== undefined) {
    const parser = number()
      .freeze(`${attribute.path}[$ADD]`)
      .build(Parser)
      .start(inputValue[$ADD], {
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
