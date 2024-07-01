import type { PrimitiveAttribute } from './interface.js'
import type { ResolvePrimitiveAttributeType } from './types.js'

export type ResolvePrimitiveAttribute<ATTRIBUTE extends PrimitiveAttribute> =
  ATTRIBUTE['enum'] extends ResolvePrimitiveAttributeType<ATTRIBUTE['type']>[]
    ? ATTRIBUTE['enum'][number]
    : ResolvePrimitiveAttributeType<ATTRIBUTE['type']>
