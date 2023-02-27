import type { ResolvedAttribute, AnyAttribute } from 'v1/item'

export type AnyAttributePutItem<ANY_ATTRIBUTE extends AnyAttribute> = ANY_ATTRIBUTE extends {
  required: 'never'
}
  ? undefined | ResolvedAttribute
  : ResolvedAttribute
