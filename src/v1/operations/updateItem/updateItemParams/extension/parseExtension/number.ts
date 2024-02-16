import cloneDeep from 'lodash.clonedeep'

import type { PrimitiveAttribute, ValidValue, AttributeBasicValue } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/schema/actions/parse/types'
import { attrWorkflow } from 'v1/schema/actions/parse/attribute'
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
  inputValue: unknown,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const { fill = true, transform = true } = options

  if (hasSumOperation(inputValue)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parsers: Generator<
          ValidValue<PrimitiveAttribute<'number'>, ReferenceExtension>,
          ValidValue<PrimitiveAttribute<'number'>, ReferenceExtension>
        >[] = []

        const sumElements = inputValue[$SUM]
        const isInputValueArray = isArray(sumElements)
        if (isInputValueArray) {
          for (const sumElement of sumElements) {
            parsers.push(
              attrWorkflow<
                PrimitiveAttribute<'number'>,
                ReferenceExtension,
                UpdateItemInputExtension
              >(
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

        if (!isInputValueArray || !ACCEPTABLE_LENGTH_SET.has(sumElements.length)) {
          const { path } = attribute

          throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
            message: `Sum for number attribute ${
              path !== undefined ? `'${path}' ` : ''
            }should be a tuple of length 1 or 2`,
            path,
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
          ValidValue<PrimitiveAttribute<'number'>, ReferenceExtension>,
          ValidValue<PrimitiveAttribute<'number'>, ReferenceExtension>
        >[] = []

        const subtractElements = inputValue[$SUBTRACT]
        const isInputValueArray = isArray(subtractElements)
        if (isInputValueArray) {
          for (const subtractElement of subtractElements) {
            parsers.push(
              attrWorkflow<
                PrimitiveAttribute<'number'>,
                ReferenceExtension,
                UpdateItemInputExtension
              >(
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

        if (!isInputValueArray || !ACCEPTABLE_LENGTH_SET.has(subtractElements.length)) {
          const { path } = attribute

          throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
            message: `Subtraction for number attribute ${
              path !== undefined ? `'${path}' ` : ''
            }should be a tuple of length 1 or 2`,
            path,
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
    const parser = attrWorkflow<
      PrimitiveAttribute<'number'>,
      ReferenceExtension,
      UpdateItemInputExtension
    >(
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
