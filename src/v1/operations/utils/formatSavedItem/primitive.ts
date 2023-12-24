import type {
  PrimitiveAttribute,
  AttributeValue,
  PrimitiveAttributeValue,
  ResolvedPrimitiveAttribute,
  Transformer
} from 'v1/schema'
import { validatorsByPrimitiveType } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

export const parseSavedPrimitiveAttribute = (
  primitiveAttribute: PrimitiveAttribute,
  _savedPrimitive: AttributeValue
): PrimitiveAttributeValue => {
  const validator = validatorsByPrimitiveType[primitiveAttribute.type]
  if (!validator(_savedPrimitive)) {
    throw new DynamoDBToolboxError('operations.formatSavedItem.invalidSavedAttribute', {
      message: `Invalid attribute in saved item: ${primitiveAttribute.path}. Should be a ${primitiveAttribute.type}`,
      path: primitiveAttribute.path,
      payload: {
        received: _savedPrimitive,
        expected: primitiveAttribute.type
      }
    })
  }

  /**
   * @debt type "validator should act as typeguard"
   */
  const savedPrimitive = _savedPrimitive as ResolvedPrimitiveAttribute
  const transformer = primitiveAttribute.transform as Transformer
  const formattedValue =
    transformer !== undefined ? transformer.format(savedPrimitive) : savedPrimitive

  if (primitiveAttribute.enum !== undefined && !primitiveAttribute.enum.includes(formattedValue)) {
    throw new DynamoDBToolboxError('operations.formatSavedItem.invalidSavedAttribute', {
      message: `Invalid attribute in saved item: ${
        primitiveAttribute.path
      }. Should be one of: ${primitiveAttribute.enum.map(String).join(', ')}`,
      path: primitiveAttribute.path,
      payload: {
        received: formattedValue,
        expected: primitiveAttribute.enum
      }
    })
  }

  return formattedValue
}
