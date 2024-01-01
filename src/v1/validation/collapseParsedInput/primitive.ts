import type { PrimitiveAttribute, PrimitiveAttributeBasicValue, Transformer } from 'v1/schema'

export const collapsePrimitiveAttributeParsedInput = (
  primitiveAttribute: PrimitiveAttribute,
  primitiveInput: PrimitiveAttributeBasicValue
): PrimitiveAttributeBasicValue =>
  primitiveAttribute.transform !== undefined
    ? (primitiveAttribute.transform as Transformer).parse(primitiveInput)
    : primitiveInput
