import type { AnySchema } from './interface.js'

export type ResolveAnySchema<ATTRIBUTE extends AnySchema> = ATTRIBUTE['state']['castAs']
