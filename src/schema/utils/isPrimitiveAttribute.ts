import type { Attribute, PrimitiveAttribute, PrimitiveAttributeType } from '~/attributes/index.js'

const primitiveAttributeTypeSet = new Set<PrimitiveAttributeType>([
  'null',
  'boolean',
  'string',
  'binary'
])

type IsPrimitiveAttributeAsserter = (attribute: Attribute) => attribute is PrimitiveAttribute

export const isPrimitiveAttribute: IsPrimitiveAttributeAsserter = (
  attribute
): attribute is PrimitiveAttribute =>
  primitiveAttributeTypeSet.has(attribute.type as PrimitiveAttributeType)
