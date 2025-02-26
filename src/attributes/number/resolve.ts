import type { NumberSchema } from './schema.js'

export type ResolveNumberSchema<ATTRIBUTE extends NumberSchema> =
  ATTRIBUTE['props']['enum'] extends (number | bigint)[]
    ? ATTRIBUTE['props']['enum'][number]
    : number | BigInt<ATTRIBUTE['props']['big']>

type BigInt<BIG extends boolean | undefined> = BIG extends true ? bigint : never

export type ResolvedNumberSchema = ResolveNumberSchema<NumberSchema>
