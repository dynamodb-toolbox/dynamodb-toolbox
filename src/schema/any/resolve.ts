import type { AnySchema } from './schema.js'

export type ResolveAnySchema<SCHEMA extends AnySchema> = SCHEMA['props']['castAs']
