import type {
  PrimitiveAttribute,
  PossiblyUndefinedResolvedAttribute,
  ResolvedPrimitiveAttribute
} from 'v1/schema'
import { validatorsByPrimitiveType } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

export const parseSavedPrimitiveAttribute = (
  primitiveAttribute: PrimitiveAttribute,
  value: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  const validator = validatorsByPrimitiveType[primitiveAttribute.type]
  if (!validator(value)) {
    throw new DynamoDBToolboxError('commands.formatSavedItem.invalidSavedAttribute', {
      message: `Invalid attribute in saved item: ${primitiveAttribute.path}. Should be a ${primitiveAttribute.type}`,
      path: primitiveAttribute.path,
      payload: {
        received: value,
        expected: primitiveAttribute.type
      }
    })
  }

  if (
    primitiveAttribute.enum !== undefined &&
    !primitiveAttribute.enum.includes(value as ResolvedPrimitiveAttribute)
  ) {
    throw new DynamoDBToolboxError('commands.formatSavedItem.invalidSavedAttribute', {
      message: `Invalid attribute in saved item: ${
        primitiveAttribute.path
      }. Should be one of: ${primitiveAttribute.enum.map(String).join(', ')}`,
      path: primitiveAttribute.path,
      payload: {
        received: value,
        expected: primitiveAttribute.enum
      }
    })
  }

  return value
}
