import {
  PrimitiveAttribute,
  PossiblyUndefinedResolvedAttribute,
  ResolvedPrimitiveAttribute,
  KeyInput
} from 'v1'
import { validatorsByPrimitiveType } from 'v1/utils/validation'

export const parsePrimitiveAttributeKeyInput = <PRIMITIVE_ATTRIBUTE extends PrimitiveAttribute>(
  primitiveAttribute: PRIMITIVE_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): KeyInput<PRIMITIVE_ATTRIBUTE> => {
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

  return input as KeyInput<PRIMITIVE_ATTRIBUTE>
}
