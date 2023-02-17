import {
  PrimitiveAttribute,
  PossiblyUndefinedResolvedAttribute,
  ResolvedPrimitiveAttribute
} from 'v1'
import { validatorsByPrimitiveType } from 'v1/utils/validation'

export const parsePrimitiveAttributePutCommandInput = (
  primitiveAttribute: PrimitiveAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  const validator = validatorsByPrimitiveType[primitiveAttribute.type]
  if (!validator(input)) {
    // TODO
    throw new Error()
  }

  if (
    primitiveAttribute.enum !== undefined &&
    !primitiveAttribute.enum.includes(input as ResolvedPrimitiveAttribute)
  ) {
    // TODO
    throw new Error()
  }

  return input
}
