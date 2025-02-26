import type { BooleanSchema } from './interface.js'

export type ResolveBooleanSchema<ATTRIBUTE extends BooleanSchema> = ATTRIBUTE['state'] extends {
  enum: boolean[]
}
  ? ATTRIBUTE['state']['enum'][number]
  : boolean

export type ResolvedBooleanSchema = ResolveBooleanSchema<BooleanSchema>
