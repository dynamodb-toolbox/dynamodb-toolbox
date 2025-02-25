import type { AnyAttribute } from './interface.js'

export type ResolveAnyAttribute<ATTRIBUTE extends AnyAttribute> = ATTRIBUTE['state']['castAs']
