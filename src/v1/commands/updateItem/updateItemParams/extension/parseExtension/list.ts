import type { AttributeBasicValue, AttributeValue, ListAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/validation/parseClonedInput/types'
import type { UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'
import { isInteger } from 'v1/utils/validation/isInteger'
import { isArray } from 'v1/utils/validation/isArray'
import { $SET, $REMOVE, $APPEND, $PREPEND } from 'v1/commands/updateItem/constants'

import { hasSetOperation, hasAppendOperation, hasPrependOperation } from '../utils'

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
    const parsedExtension: {
      [KEY in number]: AttributeValue<UpdateItemInputExtension> | $REMOVE
    } = {}

    for (const [inputKey, inputValue] of Object.entries(input)) {
      const parsedInputKey = parseFloat(inputKey)

      if (!isInteger(parseFloat(inputKey))) {
        throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
          message: `Index of array attribute ${attribute.path} is not a valid integer`,
          path: attribute.path,
          payload: {
            received: inputKey
          }
        })
      }

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

    // Omit parseExtension as $append/$prepend means non-extended values
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { parseExtension: _, ...restOptions } = options

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

      Object.assign(parsedExtension, {
        [$APPEND]: input[$APPEND].map(element =>
          // TODO: Allow refs
          parseAttributeClonedInput(attribute.elements, element as AttributeValue, restOptions)
        )
      })
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

      Object.assign(parsedExtension, {
        [$PREPEND]: input[$PREPEND].map(element =>
          // TODO: Allow refs
          parseAttributeClonedInput(attribute.elements, element as AttributeValue, restOptions)
        )
      })
    }

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
