import type { AttributeValue } from 'v1/schema'
import type { ExtensionParser } from 'v1/validation/parseClonedInput/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'

import type { UpdateItemInputExtension } from '../../types'
import { $add, $delete, $remove } from '../../constants'

import { hasAddOperation, hasDeleteOperation } from './utils'
import { DynamoDBToolboxError } from 'v1/errors'

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

  return {
    isExtension: false,
    basicInput: input
  }
}
