import type { BooleanSchema } from './schema.js'

export type ResolveBooleanSchema<ATTRIBUTE extends BooleanSchema> = ATTRIBUTE['props'] extends {
  enum: boolean[]
}
  ? ATTRIBUTE['props']['enum'][number]
  : boolean

export type ResolvedBooleanSchema = ResolveBooleanSchema<BooleanSchema>
