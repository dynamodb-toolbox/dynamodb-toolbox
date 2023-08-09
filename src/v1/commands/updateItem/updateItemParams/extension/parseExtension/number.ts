import type { AttributeBasicValue, AttributeValue, PrimitiveAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/validation/parseClonedInput/types'
import type { ReferenceExtension, UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'
import { $SUM, $SUBTRACT, $ADD } from 'v1/commands/updateItem/constants'
import { isArray } from 'v1/utils/validation/isArray'
import { DynamoDBToolboxError } from 'v1/errors'

import { hasSumOperation, hasSubtractOperation, hasAddOperation } from '../utils'
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

    const parsedExtension: AttributeValue<UpdateItemInputExtension> = {}
    Object.assign(parsedExtension, {
      [$SUM]: input[$SUM].map(element =>
        parseAttributeClonedInput(attribute, element, {
          ...options,
          parseExtension: parseReferenceExtension
        })
      )
    })

    return {
      isExtension: true,
      parsedExtension
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

    const parsedExtension: AttributeValue<UpdateItemInputExtension> = {}
    Object.assign(parsedExtension, {
      [$SUBTRACT]: input[$SUBTRACT].map(element =>
        parseAttributeClonedInput(attribute, element, {
          ...options,
          parseExtension: parseReferenceExtension
        })
      )
    })

    return {
      isExtension: true,
      parsedExtension
    }
  }

  if (hasAddOperation<ReferenceExtension>(input)) {
    const parsedExtension: AttributeValue<UpdateItemInputExtension> = {}

    Object.assign(parsedExtension, {
      [$ADD]: parseAttributeClonedInput<ReferenceExtension>(attribute, input[$ADD], {
        ...options,
        parseExtension: parseReferenceExtension
      })
    })

    return {
      isExtension: true,
      parsedExtension
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
