import type { AnyAttribute } from './interface'

export type ResolveAnyAttribute<
  ATTRIBUTE extends AnyAttribute,
  OPTIONS extends { key: boolean } = { key: false }
> = ATTRIBUTE['castAs']
