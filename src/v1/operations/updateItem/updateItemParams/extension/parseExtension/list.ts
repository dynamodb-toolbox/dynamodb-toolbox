import type {
  AttributeBasicValue,
  AttributeValue,
  ListAttribute,
  ListAttributeBasicValue
} from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/validation/parseClonedInput/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'
import { isInteger } from 'v1/utils/validation/isInteger'
import { isArray } from 'v1/utils/validation/isArray'

import type { ReferenceExtension, UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $SET, $REMOVE, $APPEND, $PREPEND } from 'v1/operations/updateItem/constants'
import {
  hasSetOperation,
  hasAppendOperation,
  hasPrependOperation
} from 'v1/operations/updateItem/utils'

import { parseReferenceExtension } from './reference'

export const parseListExtension = (
  attribute: ListAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (hasSetOperation(input)) {
    return {
      isExtension: true,
      parsedExtension: {
        /**
         * @debt type "Maybe this cast can be omitted by clever typing of parseAttributeClonedInput"
         */
        [$SET]: parseAttributeClonedInput(attribute, input[$SET]) as ListAttributeBasicValue
      }
    }
  }

  if (isObject(input) || isArray(input)) {
    if (hasAppendOperation(input)) {
      const appendedValue = input[$APPEND]

      if (isArray(appendedValue)) {
        return {
          isExtension: true,
          parsedExtension: {
            [$APPEND]: appendedValue.map(element =>
              parseAttributeClonedInput<never>(attribute.elements, element)
            )
          }
        }
      }

      return {
        isExtension: true,
        parsedExtension: {
          [$APPEND]: parseAttributeClonedInput<ReferenceExtension>(attribute, appendedValue, {
            parseExtension: parseReferenceExtension
          })
        }
      }
    }

    if (hasPrependOperation(input)) {
      const prependedValue = input[$PREPEND]

      if (isArray(prependedValue)) {
        return {
          isExtension: true,
          parsedExtension: {
            [$PREPEND]: prependedValue.map(element =>
              parseAttributeClonedInput<never>(attribute.elements, element)
            )
          }
        }
      }

      return {
        isExtension: true,
        parsedExtension: {
          [$PREPEND]: parseAttributeClonedInput<ReferenceExtension>(attribute, prependedValue, {
            parseExtension: parseReferenceExtension
          })
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
