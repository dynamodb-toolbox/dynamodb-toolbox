import type {
  PrimitiveAttribute,
  PossiblyUndefinedResolvedAttribute,
  ResolvedPrimitiveAttribute,
  AttributeKeyInput
} from 'v1'
import { validatorsByPrimitiveType } from 'v1/utils/validation'

export const parsePrimitiveAttributeKeyInput = <PRIMITIVE_ATTRIBUTE extends PrimitiveAttribute>(
  primitiveAttribute: PRIMITIVE_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): AttributeKeyInput<PRIMITIVE_ATTRIBUTE> => {
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

  return input as AttributeKeyInput<PRIMITIVE_ATTRIBUTE>
}
