import type { AnySchema } from './schema.js'

export type ResolveAnySchema<ATTRIBUTE extends AnySchema> = ATTRIBUTE['state']['castAs']
