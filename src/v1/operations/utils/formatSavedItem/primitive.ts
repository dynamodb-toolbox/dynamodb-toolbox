import type {
  PrimitiveAttribute,
  AttributeValue,
  PrimitiveAttributeValue,
  ResolvedPrimitiveAttribute
} from 'v1/schema'
import { validatorsByPrimitiveType } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

export const parseSavedPrimitiveAttribute = (
  primitiveAttribute: PrimitiveAttribute,
  savedPrimitive: AttributeValue
): PrimitiveAttributeValue => {
  const validator = validatorsByPrimitiveType[primitiveAttribute.type]
  if (!validator(savedPrimitive)) {
    throw new DynamoDBToolboxError('commands.formatSavedItem.invalidSavedAttribute', {
      message: `Invalid attribute in saved item: ${primitiveAttribute.path}. Should be a ${primitiveAttribute.type}`,
      path: primitiveAttribute.path,
      payload: {
        received: savedPrimitive,
        expected: primitiveAttribute.type
      }
    })
  }

  if (
    primitiveAttribute.enum !== undefined &&
    !primitiveAttribute.enum.includes(savedPrimitive as ResolvedPrimitiveAttribute)
  ) {
    throw new DynamoDBToolboxError('commands.formatSavedItem.invalidSavedAttribute', {
      message: `Invalid attribute in saved item: ${
        primitiveAttribute.path
      }. Should be one of: ${primitiveAttribute.enum.map(String).join(', ')}`,
      path: primitiveAttribute.path,
      payload: {
        received: savedPrimitive,
        expected: primitiveAttribute.enum
      }
    })
  }

  /**
   * @debt type "validator should act as typeguard"
   */
  return savedPrimitive as ResolvedPrimitiveAttribute
}
