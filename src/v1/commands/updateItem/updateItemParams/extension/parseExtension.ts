import { AttributeValue } from 'v1/schema'
import type { ExtensionParser } from 'v1/validation/parseClonedInput/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'
import { parsePrimitiveAttributeClonedInput } from 'v1/validation/parseClonedInput/primitive'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'
import { isInteger } from 'v1/utils/validation/isInteger'

import type { UpdateItemInputExtension } from '../../types'
import { $add, $delete, $remove, $set } from '../../constants'
import { hasAddOperation, hasDeleteOperation, hasSetOperation } from './utils'

export const parseExtension: ExtensionParser<UpdateItemInputExtension> = (
  attribute,
  input,
  options
) => {
  if (input === $remove) {
    if (attribute.required !== 'never') {
      throw new DynamoDBToolboxError('parsing.attributeRequired', {
        message: `Attribute ${attribute.path} is required and cannot be removed`,
        path: attribute.path
      })
    }

    return {
      isExtension: true,
      parsedExtension: $remove
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
        [$add]: parseAttributeClonedInput(attribute, input[$add], options)
      })
    }

    if (hasDelete) {
      Object.assign(parsedExtension, {
        [$delete]: parseAttributeClonedInput(attribute, input[$delete], options)
      })
    }

    return {
      isExtension: true,
      parsedExtension
    }
  }

  if (attribute.type === 'list' && isObject(input)) {
    const parsedExtension: {
      [KEY in number]: AttributeValue<UpdateItemInputExtension> | $remove
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

      // $remove is allowed
      if (inputValue === $remove) {
        parsedExtension[parsedInputKey] = $remove
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

  if ((attribute.type === 'map' || attribute.type === 'record') && hasSetOperation(input)) {
    // Omit parseExtension as $set means non-extended values
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { parseExtension: _, ...restOptions } = options

    return {
      isExtension: true,
      parsedExtension: {
        [$set]: parseAttributeClonedInput(attribute, input[$set], restOptions)
      }
    }
  }

  if (attribute.type === 'record' && isObject(input)) {
    const parsedExtension: {
      [KEY in string]: AttributeValue<UpdateItemInputExtension> | $remove
    } = {}

    for (const [inputKey, inputValue] of Object.entries(input)) {
      const parsedInputKey = parsePrimitiveAttributeClonedInput(attribute.keys, inputKey) as string

      // $remove is allowed
      if (inputValue === $remove) {
        parsedExtension[parsedInputKey] = $remove
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
