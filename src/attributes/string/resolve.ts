import type { StringSchema } from './schema.js'

export type ResolveStringSchema<ATTRIBUTE extends StringSchema> = ATTRIBUTE['props'] extends {
  enum: string[]
}
  ? ATTRIBUTE['props']['enum'][number]
  : string

export type ResolvedStringSchema = ResolveStringSchema<StringSchema>
