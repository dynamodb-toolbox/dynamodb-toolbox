import type { NumberSchema } from './schema.js'

export type ResolveNumberSchema<ATTRIBUTE extends NumberSchema> =
  ATTRIBUTE['state']['enum'] extends (number | bigint)[]
    ? ATTRIBUTE['state']['enum'][number]
    : number | BigInt<ATTRIBUTE['state']['big']>

type BigInt<BIG extends boolean | undefined> = BIG extends true ? bigint : never

export type ResolvedNumberSchema = ResolveNumberSchema<NumberSchema>
