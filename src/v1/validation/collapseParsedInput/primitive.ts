import type {
  PrimitiveAttribute,
  PrimitiveAttributeBasicValue,
  Transformer,
  Extension
} from 'v1/schema'

import type { CollapsingOptions } from './types'

export const collapsePrimitiveAttributeParsedInput = <EXTENSION extends Extension = never>(
  primitiveAttribute: PrimitiveAttribute,
  primitiveInput: PrimitiveAttributeBasicValue,
  { transform = true } = {} as CollapsingOptions<EXTENSION>
): PrimitiveAttributeBasicValue =>
  transform && primitiveAttribute.transform !== undefined
    ? (primitiveAttribute.transform as Transformer).parse(primitiveInput)
    : primitiveInput
