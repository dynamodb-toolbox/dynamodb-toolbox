import type { AnyAttribute } from './interface'

export type ResolveAnyAttribute<ATTRIBUTE extends AnyAttribute> = ATTRIBUTE['castAs']
