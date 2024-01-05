import cloneDeep from 'lodash.clonedeep'

import type { AttributeBasicValue, AttributeValue, PrimitiveAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/validation/parseClonedInput/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'
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
              parseAttributeClonedInput<ReferenceExtension, UpdateItemInputExtension>(
                attribute,
                sumElement,
                // References are allowed in sums
                { ...options, parseExtension: parseReferenceExtension }
              )
            )
          }
        }

        const clonedValue = {
          [$SUM]: isInputValueArray
            ? parsers.map(parser => parser.next().value)
            : cloneDeep(inputValue[$SUM])
        }
        yield clonedValue

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
        yield parsedValue

        const collapsedValue = { [$SUM]: parsers.map(parser => parser.next().value) }
        return collapsedValue
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
          for (const sumElement of inputValue[$SUBTRACT]) {
            parsers.push(
              parseAttributeClonedInput<ReferenceExtension, UpdateItemInputExtension>(
                attribute,
                sumElement,
                // References are allowed in sums
                { ...options, parseExtension: parseReferenceExtension }
              )
            )
          }
        }

        const clonedValue = {
          [$SUBTRACT]: isInputValueArray
            ? parsers.map(parser => parser.next().value)
            : cloneDeep(inputValue[$SUBTRACT])
        }
        yield clonedValue

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
        yield parsedValue

        const collapsedValue = { [$SUBTRACT]: parsers.map(parser => parser.next().value) }
        return collapsedValue
      }
    }
  }

  if (hasAddOperation(inputValue)) {
    const parser = parseAttributeClonedInput<ReferenceExtension, UpdateItemInputExtension>(
      attribute,
      inputValue[$ADD],
      // References are allowed in additions
      { ...options, parseExtension: parseReferenceExtension }
    )

    return {
      isExtension: true,
      *extensionParser() {
        const clonedValue = { [$ADD]: parser.next().value }
        yield clonedValue

        const parsedValue = { [$ADD]: parser.next().value }
        yield parsedValue

        const collapsedValue = { [$ADD]: parser.next().value }
        return collapsedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: inputValue as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
