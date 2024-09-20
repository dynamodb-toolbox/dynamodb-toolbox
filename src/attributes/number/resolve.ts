import type { NumberAttribute } from './interface.js'

export type ResolveNumberAttribute<ATTRIBUTE extends NumberAttribute> = ATTRIBUTE extends {
  enum: number[]
}
  ? ATTRIBUTE['enum'][number]
  : // TODO: support bigInts if big: true
    number

export type ResolvedNumberAttribute = ResolveNumberAttribute<NumberAttribute>
