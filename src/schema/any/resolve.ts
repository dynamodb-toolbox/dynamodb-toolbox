import type { AnySchema } from './schema.js'

/**
 * Resolves an `any` schema to its runtime type.
 */
export type ResolveAnySchema<SCHEMA extends AnySchema> = SCHEMA['props']['castAs']
