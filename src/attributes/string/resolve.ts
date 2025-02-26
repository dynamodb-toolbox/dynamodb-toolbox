import type { StringSchema } from './schema.js'

export type ResolveStringSchema<ATTRIBUTE extends StringSchema> = ATTRIBUTE['state'] extends {
  enum: string[]
}
  ? ATTRIBUTE['state']['enum'][number]
  : string

export type ResolvedStringSchema = ResolveStringSchema<StringSchema>
