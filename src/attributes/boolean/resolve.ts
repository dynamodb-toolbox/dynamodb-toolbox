import type { BooleanSchema } from './schema.js'

export type ResolveBooleanSchema<ATTRIBUTE extends BooleanSchema> = ATTRIBUTE['state'] extends {
  enum: boolean[]
}
  ? ATTRIBUTE['state']['enum'][number]
  : boolean

export type ResolvedBooleanSchema = ResolveBooleanSchema<BooleanSchema>
