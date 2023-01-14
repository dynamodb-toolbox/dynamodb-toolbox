import type { ResolvedAttribute, _AnyAttribute } from 'v1/item'

export type _AnyAttributePutItem<_ANY_ATTRIBUTE extends _AnyAttribute> = _ANY_ATTRIBUTE extends {
  _required: 'never'
}
  ? undefined | ResolvedAttribute
  : ResolvedAttribute
