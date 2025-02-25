import type { StringAttribute } from './interface.js'

export type ResolveStringAttribute<ATTRIBUTE extends StringAttribute> = ATTRIBUTE['state'] extends {
  enum: string[]
}
  ? ATTRIBUTE['state']['enum'][number]
  : string

export type ResolvedStringAttribute = ResolveStringAttribute<StringAttribute>
