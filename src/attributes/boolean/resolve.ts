import type { BooleanAttribute } from './interface.js'

export type ResolveBooleanAttribute<ATTRIBUTE extends BooleanAttribute> =
  ATTRIBUTE['state'] extends { enum: boolean[] } ? ATTRIBUTE['state']['enum'][number] : boolean

export type ResolvedBooleanAttribute = ResolveBooleanAttribute<BooleanAttribute>
