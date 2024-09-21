import type { NumberAttribute } from './interface.js'
import type { NumberAttributeState } from './types.js'

export type ResolveNumberAttribute<ATTRIBUTE extends NumberAttribute> = ATTRIBUTE extends {
  enum: NonNullable<NumberAttributeState['enum']>
}
  ? ATTRIBUTE['enum'][number]
  : // TODO: support bigInts if big: true
    number

export type ResolvedNumberAttribute = ResolveNumberAttribute<NumberAttribute>
