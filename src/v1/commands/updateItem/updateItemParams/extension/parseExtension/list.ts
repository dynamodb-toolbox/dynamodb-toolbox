import type { AttributeBasicValue, AttributeValue, ListAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/validation/parseClonedInput/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'
import { isInteger } from 'v1/utils/validation/isInteger'
import { isArray } from 'v1/utils/validation/isArray'

import type { UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { $SET, $REMOVE, $APPEND, $PREPEND } from 'v1/commands/updateItem/constants'
import {
  hasSetOperation,
  hasAppendOperation,
  hasPrependOperation
} from 'v1/commands/updateItem/utils'

import { parseReferenceExtension } from './reference'

export const parseListExtension = (
  attribute: ListAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (hasSetOperation(input)) {
    // Omit parseExtension as $set means non-extended values
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { parseExtension: _, ...restOptions } = options

    return {
      isExtension: true,
      parsedExtension: {
        [$SET]: parseAttributeClonedInput(attribute, input[$SET], restOptions)
      }
    }
  }

  if (isObject(input) || isArray(input)) {
    if (hasAppendOperation(input)) {
      if (!isArray(input[$APPEND])) {
        throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
          message: `Appended values of array attribute ${attribute.path} should be listed in an array`,
          path: attribute.path,
          payload: {
            received: input[$APPEND]
          }
        })
      }

      return {
        isExtension: true,
        parsedExtension: {
          [$APPEND]: input[$APPEND].map(element =>
            parseAttributeClonedInput(attribute.elements, element, {
              ...options,
              parseExtension: parseReferenceExtension
            })
          )
        }
      }
    }

    if (hasPrependOperation(input)) {
      if (!isArray(input[$PREPEND])) {
        throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
          message: `Prepended values of array attribute ${attribute.path} should be listed in an array`,
          path: attribute.path,
          payload: {
            received: input[$PREPEND]
          }
        })
      }

      return {
        isExtension: true,
        parsedExtension: {
          [$PREPEND]: input[$PREPEND].map(element =>
            parseAttributeClonedInput(attribute.elements, element, {
              ...options,
              parseExtension: parseReferenceExtension
            })
          )
        }
      }
    }

    let maxUpdatedIndex = 0
    const parsedExtension: {
      [KEY in number]: AttributeValue<UpdateItemInputExtension> | $REMOVE
    } = {}

    for (const [inputKey, inputValue] of Object.entries(input)) {
      const parsedInputKey = parseFloat(inputKey)

      if (!isInteger(parsedInputKey)) {
        throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
          message: `Index of array attribute ${attribute.path} is not a valid integer`,
          path: attribute.path,
          payload: {
            received: inputKey
          }
        })
      }

      maxUpdatedIndex = Math.max(maxUpdatedIndex, parsedInputKey)

      // undefined is allowed
      if (inputValue === undefined) {
        continue
      }

      // $REMOVE is allowed
      if (inputValue === $REMOVE) {
        parsedExtension[parsedInputKey] = $REMOVE
      } else {
        parsedExtension[parsedInputKey] = parseAttributeClonedInput(
          attribute.elements,
          inputValue,
          options
        )
      }
    }

    return {
      isExtension: true,
      parsedExtension: [...Array(maxUpdatedIndex + 1).keys()].map(index => parsedExtension[index])
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
