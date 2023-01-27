import type { ResolvedAttribute, _AnyAttribute } from 'v1/item'
import type { $required } from 'v1/item/attributes/constants/attributeOptions'

export type _AnyAttributePutItem<_ANY_ATTRIBUTE extends _AnyAttribute> = _ANY_ATTRIBUTE extends {
  [$required]: 'never'
}
  ? undefined | ResolvedAttribute
  : ResolvedAttribute
