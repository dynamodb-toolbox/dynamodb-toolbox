import type { StringSchema } from './schema.js'

export type ResolveStringSchema<SCHEMA extends StringSchema> = SCHEMA['props'] extends {
  enum: string[]
}
  ? SCHEMA['props']['enum'][number]
  : string

export type ResolvedStringSchema = ResolveStringSchema<StringSchema>
