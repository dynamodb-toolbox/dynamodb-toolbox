import type { NumberAttribute } from './interface.js'
import type { NumberAttributeState } from './types.js'

export type ResolveNumberAttribute<ATTRIBUTE extends NumberAttribute> = ATTRIBUTE extends {
  enum: NonNullable<NumberAttributeState['enum']>
}
  ? ATTRIBUTE['enum'][number]
  : number | (true extends ATTRIBUTE['big'] ? bigint : never)

export type ResolvedNumberAttribute = ResolveNumberAttribute<NumberAttribute>
