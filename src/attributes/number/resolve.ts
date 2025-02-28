import type { NumberSchema } from './schema.js'

export type ResolveNumberSchema<SCHEMA extends NumberSchema> = SCHEMA['props']['enum'] extends (
  | number
  | bigint
)[]
  ? SCHEMA['props']['enum'][number]
  : number | BigInt<SCHEMA['props']['big']>

type BigInt<BIG extends boolean | undefined> = BIG extends true ? bigint : never

export type ResolvedNumberSchema = ResolveNumberSchema<NumberSchema>
