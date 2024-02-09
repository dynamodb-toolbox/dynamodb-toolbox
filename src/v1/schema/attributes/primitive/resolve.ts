import type { PrimitiveAttribute } from './interface'
import type { ResolvePrimitiveAttributeType } from './types'

export type ResolvePrimitiveAttribute<
  ATTRIBUTE extends PrimitiveAttribute,
  OPTIONS extends { key: boolean } = { key: false }
> = ATTRIBUTE['enum'] extends ResolvePrimitiveAttributeType<ATTRIBUTE['type']>[]
  ? ATTRIBUTE['enum'][number]
  : ResolvePrimitiveAttributeType<ATTRIBUTE['type']>
