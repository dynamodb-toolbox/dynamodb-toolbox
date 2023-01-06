import {
  PrimitiveAttribute,
  PossiblyUndefinedResolvedAttribute,
  ResolvedPrimitiveAttribute,
  PutItem
} from 'v1'
import { validatorsByPrimitiveType } from 'v1/utils/validation'

export const parsePrimitiveAttributePutCommandInput = <
  PRIMITIVE_ATTRIBUTE extends PrimitiveAttribute
>(
  primitiveAttribute: PRIMITIVE_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): PutItem<PRIMITIVE_ATTRIBUTE> => {
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

  return input as PutItem<PRIMITIVE_ATTRIBUTE>
}
