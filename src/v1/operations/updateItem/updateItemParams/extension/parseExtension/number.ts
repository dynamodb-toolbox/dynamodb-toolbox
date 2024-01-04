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
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (hasSumOperation(input)) {
    if (!isArray(input[$SUM]) || !ACCEPTABLE_LENGTH_SET.has(input[$SUM].length)) {
      throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
        message: `Sum for number attribute ${attribute.path} should be a tuple of length 1 or 2`,
        path: attribute.path,
        payload: {
          received: input[$SUM]
        }
      })
    }

    const parsers = input[$SUM].map(element =>
      parseAttributeClonedInput<ReferenceExtension>(attribute, element, {
        ...options,
        // References are allowed in sums
        parseExtension: parseReferenceExtension
      })
    )

    return {
      isExtension: true,
      *extensionParser() {
        yield { [$SUM]: parsers.map(parser => parser.next().value) }
        return { [$SUM]: parsers.map(parser => parser.next().value) }
      }
    }
  }

  if (hasSubtractOperation(input)) {
    if (!isArray(input[$SUBTRACT]) || !ACCEPTABLE_LENGTH_SET.has(input[$SUBTRACT].length)) {
      throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
        message: `Subtraction for number attribute ${attribute.path} should be a tuple of length 1 or 2`,
        path: attribute.path,
        payload: {
          received: input[$SUBTRACT]
        }
      })
    }

    const parsers = input[$SUBTRACT].map(element =>
      parseAttributeClonedInput<ReferenceExtension>(attribute, element, {
        ...options,
        // References are allowed in subtractions
        parseExtension: parseReferenceExtension
      })
    )

    return {
      isExtension: true,
      *extensionParser() {
        yield { [$SUBTRACT]: parsers.map(parser => parser.next().value) }
        return { [$SUBTRACT]: parsers.map(parser => parser.next().value) }
      }
    }
  }

  if (hasAddOperation(input)) {
    const parser = parseAttributeClonedInput<ReferenceExtension>(attribute, input[$ADD], {
      ...options,
      // References are allowed in additions
      parseExtension: parseReferenceExtension
    })

    return {
      isExtension: true,
      *extensionParser() {
        yield { [$ADD]: parser.next().value }
        return { [$ADD]: parser.next().value }
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
