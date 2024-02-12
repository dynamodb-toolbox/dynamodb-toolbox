import type {
  PrimitiveAttribute,
  AttributeValue,
  PrimitiveAttributeValue,
  ResolvedPrimitiveAttribute,
  Transformer
} from 'v1/schema'
import { validatorsByPrimitiveType } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

export const formatSavedPrimitiveAttribute = (
  attribute: PrimitiveAttribute,
  savedValue: AttributeValue
): PrimitiveAttributeValue => {
  const validator = validatorsByPrimitiveType[attribute.type]
  if (!validator(savedValue)) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path,
      payload: {
        received: savedValue,
        expected: type
      }
    })
  }

  /**
   * @debt type "validator should act as typeguard"
   */
  const savedPrimitive = savedValue as ResolvedPrimitiveAttribute
  const transformer = attribute.transform as Transformer
  const formattedValue =
    transformer !== undefined ? transformer.format(savedPrimitive) : savedPrimitive

  if (attribute.enum !== undefined && !attribute.enum.includes(formattedValue)) {
    const { path } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be one of: ${attribute.enum.map(String).join(', ')}.`,
      path,
      payload: {
        received: formattedValue,
        expected: attribute.enum
      }
    })
  }

  return formattedValue
}
