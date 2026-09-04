import type { NumberSchema } from './schema.js'

/**
 * Resolves a number schema to its runtime type.
 */
export type ResolveNumberSchema<SCHEMA extends NumberSchema> = SCHEMA['props']['enum'] extends (
  | number
  | bigint
)[]
  ? SCHEMA['props']['enum'][number]
  : number | WithBigInt<SCHEMA['props']['big']>

type WithBigInt<BIG extends boolean | undefined> = BIG extends true ? bigint : never

/**
 * Runtime type of a number schema (`number`).
 */
export type ResolvedNumberSchema = ResolveNumberSchema<NumberSchema>
