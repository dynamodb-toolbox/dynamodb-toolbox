import cloneDeep from 'lodash.clonedeep'

import type { AttributeBasicValue, AttributeValue, PrimitiveAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/parsing/types'
import { attributeParser } from 'v1/parsing/attribute'
import { isArray } from 'v1/utils/validation/isArray'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ReferenceExtension, UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $SUM, $SUBTRACT, $ADD } from 'v1/operations/updateItem/constants'
import {
  hasSumOperation,
  hasSubtractOperation,
  hasAddOperation
} from 'v1/operations/updateItem/utils'

import { parseReferenceExtension } from './reference'

const ACCEPTABLE_LENGTH_SET = new Set<number>([1, 2])

export const parseNumberExtension = (
  attribute: PrimitiveAttribute<'number'>,
  inputValue: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const { fill = true, transform = true } = options

  if (hasSumOperation(inputValue)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parsers: Generator<
          AttributeValue<ReferenceExtension>,
          AttributeValue<ReferenceExtension>
        >[] = []

        const isInputValueArray = isArray(inputValue[$SUM])
        if (isInputValueArray) {
          for (const sumElement of inputValue[$SUM]) {
            parsers.push(
              attributeParser<ReferenceExtension, UpdateItemInputExtension>(
                attribute,
                sumElement,
                // References are allowed in sums
                { ...options, parseExtension: parseReferenceExtension }
              )
            )
          }
        }

        if (fill) {
          if (isInputValueArray) {
            const defaultedValue = {
              [$SUM]: parsers.map(parser => parser.next().value)
            }
            yield defaultedValue

            const linkedValue = {
              [$SUM]: parsers.map(parser => parser.next().value)
            }
            yield linkedValue
          } else {
            const defaultedValue = { [$SUM]: cloneDeep(inputValue[$SUM]) }
            yield defaultedValue

            const linkedValue = defaultedValue
            yield linkedValue
          }
        }

        if (!isInputValueArray || !ACCEPTABLE_LENGTH_SET.has(inputValue[$SUM].length)) {
          throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
            message: `Sum for number attribute ${attribute.path} should be a tuple of length 1 or 2`,
            path: attribute.path,
            payload: {
              received: inputValue[$SUM]
            }
          })
        }

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

  if (hasSubtractOperation(inputValue)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parsers: Generator<
          AttributeValue<ReferenceExtension>,
          AttributeValue<ReferenceExtension>
        >[] = []

        const isInputValueArray = isArray(inputValue[$SUBTRACT])
        if (isInputValueArray) {
          for (const subtractElement of inputValue[$SUBTRACT]) {
            parsers.push(
              attributeParser<ReferenceExtension, UpdateItemInputExtension>(
                attribute,
                subtractElement,
                // References are allowed in subtractions
                { ...options, parseExtension: parseReferenceExtension }
              )
            )
          }
        }

        if (fill) {
          if (isInputValueArray) {
            const defaultedValue = {
              [$SUBTRACT]: parsers.map(parser => parser.next().value)
            }
            yield defaultedValue

            const linkedValue = {
              [$SUBTRACT]: parsers.map(parser => parser.next().value)
            }
            yield linkedValue
          } else {
            const defaultedValue = { [$SUBTRACT]: cloneDeep(inputValue[$SUBTRACT]) }
            yield defaultedValue

            const linkedValue = defaultedValue
            yield linkedValue
          }
        }

        if (!isInputValueArray || !ACCEPTABLE_LENGTH_SET.has(inputValue[$SUBTRACT].length)) {
          throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
            message: `Subtraction for number attribute ${attribute.path} should be a tuple of length 1 or 2`,
            path: attribute.path,
            payload: {
              received: inputValue[$SUBTRACT]
            }
          })
        }

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

  if (hasAddOperation(inputValue)) {
    const parser = attributeParser<ReferenceExtension, UpdateItemInputExtension>(
      attribute,
      inputValue[$ADD],
      // References are allowed in additions
      { ...options, parseExtension: parseReferenceExtension }
    )

    return {
      isExtension: true,
      *extensionParser() {
        if (fill) {
          const defaultedValue = { [$ADD]: parser.next().value }
          yield defaultedValue

          const linkedValue = { [$ADD]: parser.next().value }
          yield linkedValue
        }

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
