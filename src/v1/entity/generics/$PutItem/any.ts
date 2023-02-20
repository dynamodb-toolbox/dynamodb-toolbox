import type { ResolvedAttribute, $AnyAttribute, $required } from 'v1/item'

export type $AnyAttributePutItem<$ANY_ATTRIBUTE extends $AnyAttribute> = $ANY_ATTRIBUTE extends {
  [$required]: 'never'
}
  ? undefined | ResolvedAttribute
  : ResolvedAttribute
