import type { ResolvedAttribute, $AnyAttribute } from 'v1/item'
import type { $required } from 'v1/item/attributes/constants/attributeOptions'

export type $AnyAttributePutItem<$ANY_ATTRIBUTE extends $AnyAttribute> = $ANY_ATTRIBUTE extends {
  [$required]: 'never'
}
  ? undefined | ResolvedAttribute
  : ResolvedAttribute
