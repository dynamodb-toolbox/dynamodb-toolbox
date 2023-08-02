import type { AttributeValue } from 'v1/schema'
import type { ExtensionParser } from 'v1/validation/parseClonedInput/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'
import { parsePrimitiveAttributeClonedInput } from 'v1/validation/parseClonedInput/primitive'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'
import { isInteger } from 'v1/utils/validation/isInteger'
import { isArray } from 'v1/utils/validation/isArray'

import type { UpdateItemInputExtension } from '../../types'
import { $ADD, $DELETE, $REMOVE, $SET, $APPEND, $PREPEND } from '../../constants'
import {
  hasAddOperation,
  hasDeleteOperation,
  hasSetOperation,
  hasAppendOperation,
  hasPrependOperation
} from './utils'

export const parseExtension: ExtensionParser<UpdateItemInputExtension> = (
  attribute,
  input,
  options
) => {
  if (input === $REMOVE) {
    if (attribute.required !== 'never') {
      throw new DynamoDBToolboxError('parsing.attributeRequired', {
        message: `Attribute ${attribute.path} is required and cannot be removed`,
        path: attribute.path
      })
    }

    return {
      isExtension: true,
      parsedExtension: $REMOVE
    }
  }

  const hasAdd = hasAddOperation(input)
  const hasDelete = hasDeleteOperation(input)

  if (hasAdd || hasDelete) {
    if (hasAdd && attribute.type !== 'set' && attribute.type !== 'number') {
      throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
        message: `Attribute ${attribute.path} is neither a set nor a number and does not support ADD updates`,
        path: attribute.path,
        payload: {
          received: input
        }
      })
    }

    if (hasDelete && (attribute.type !== 'set' || attribute.type !== 'set')) {
      throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
        message: `Attribute ${attribute.path} is not a set and does not support DELETE updates`,
        path: attribute.path,
        payload: {
          received: input
        }
      })
    }

    const parsedExtension: AttributeValue<UpdateItemInputExtension> = {}

    if (hasAdd) {
      Object.assign(parsedExtension, {
        [$ADD]: parseAttributeClonedInput(attribute, input[$ADD], options)
      })
    }

    if (hasDelete) {
      Object.assign(parsedExtension, {
        [$DELETE]: parseAttributeClonedInput(attribute, input[$DELETE], options)
      })
    }

    return {
      isExtension: true,
      parsedExtension
    }
  }

  if (attribute.type === 'list' && isObject(input)) {
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
          parseAttributeClonedInput(attribute.elements, element as AttributeValue, restOptions)
        )
      })
    }

    return {
      isExtension: true,
      parsedExtension
    }
  }

  if ((attribute.type === 'map' || attribute.type === 'record') && hasSetOperation(input)) {
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

  if (attribute.type === 'record' && isObject(input)) {
    const parsedExtension: {
      [KEY in string]: AttributeValue<UpdateItemInputExtension> | $REMOVE
    } = {}

    for (const [inputKey, inputValue] of Object.entries(input)) {
      const parsedInputKey = parsePrimitiveAttributeClonedInput(attribute.keys, inputKey) as string

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
      parsedExtension
    }
  }

  return {
    isExtension: false,
    basicInput: input
  }
}
