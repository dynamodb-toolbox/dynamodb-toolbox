import type { BooleanSchema } from './schema.js'

export type ResolveBooleanSchema<SCHEMA extends BooleanSchema> = SCHEMA['props'] extends {
  enum: boolean[]
}
  ? SCHEMA['props']['enum'][number]
  : boolean

export type ResolvedBooleanSchema = ResolveBooleanSchema<BooleanSchema>
