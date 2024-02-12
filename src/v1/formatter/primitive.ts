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
  primitiveAttribute: PrimitiveAttribute,
  savedValue: AttributeValue
): PrimitiveAttributeValue => {
  const validator = validatorsByPrimitiveType[primitiveAttribute.type]
  if (!validator(savedValue)) {
    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute in saved item: ${primitiveAttribute.path}. Should be a ${primitiveAttribute.type}.`,
      path: primitiveAttribute.path,
      payload: {
        received: savedValue,
        expected: primitiveAttribute.type
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
    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute in saved item: ${
        primitiveAttribute.path
      }. Should be one of: ${primitiveAttribute.enum.map(String).join(', ')}.`,
      path: primitiveAttribute.path,
      payload: {
        received: formattedValue,
        expected: primitiveAttribute.enum
      }
    })
  }

  return formattedValue
}
