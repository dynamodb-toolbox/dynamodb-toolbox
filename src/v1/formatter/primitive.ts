import type {
  PrimitiveAttribute,
  AttributeValue,
  PrimitiveAttributeValue,
  ResolvedPrimitiveAttribute,
  Transformer
} from 'v1/schema'
import { validatorsByPrimitiveType } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatSavedAttributeOptions } from './types'
import { getItemKey } from './utils'

export const formatSavedPrimitiveAttribute = (
  primitiveAttribute: PrimitiveAttribute,
  savedValue: AttributeValue,
  options: FormatSavedAttributeOptions = {}
): PrimitiveAttributeValue => {
  const { partitionKey, sortKey } = options

  const validator = validatorsByPrimitiveType[primitiveAttribute.type]
  if (!validator(savedValue)) {
    throw new DynamoDBToolboxError('operations.formatSavedItem.invalidSavedAttribute', {
      message: [
        `Invalid attribute in saved item: ${primitiveAttribute.path}. Should be a ${primitiveAttribute.type}.`,
        getItemKey({ partitionKey, sortKey })
      ]
        .filter(Boolean)
        .join(' '),
      path: primitiveAttribute.path,
      payload: {
        received: savedValue,
        expected: primitiveAttribute.type,
        partitionKey,
        sortKey
      }
    })
  }

  /**
   * @debt type "validator should act as typeguard"
   */
  const savedPrimitive = savedValue as ResolvedPrimitiveAttribute
  const transformer = primitiveAttribute.transform as Transformer
  const formattedValue =
    transformer !== undefined ? transformer.format(savedPrimitive) : savedPrimitive

  if (primitiveAttribute.enum !== undefined && !primitiveAttribute.enum.includes(formattedValue)) {
    throw new DynamoDBToolboxError('operations.formatSavedItem.invalidSavedAttribute', {
      message: [
        `Invalid attribute in saved item: ${
          primitiveAttribute.path
        }. Should be one of: ${primitiveAttribute.enum.map(String).join(', ')}.`,
        getItemKey({ partitionKey, sortKey })
      ]
        .filter(Boolean)
        .join(' '),
      path: primitiveAttribute.path,
      payload: {
        received: formattedValue,
        expected: primitiveAttribute.enum,
        partitionKey,
        sortKey
      }
    })
  }

  return formattedValue
}
