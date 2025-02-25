import type { NumberAttribute } from './interface.js'

export type ResolveNumberAttribute<ATTRIBUTE extends NumberAttribute> =
  ATTRIBUTE['state']['enum'] extends (number | bigint)[]
    ? ATTRIBUTE['state']['enum'][number]
    : number | BigInt<ATTRIBUTE['state']['big']>

type BigInt<BIG extends boolean | undefined> = BIG extends true ? bigint : never

export type ResolvedNumberAttribute = ResolveNumberAttribute<NumberAttribute>
