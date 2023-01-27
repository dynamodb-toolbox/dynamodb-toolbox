import type { _SetAttribute } from 'v1/item'
import type { $elements, $required } from 'v1/item/attributes/constants/attributeOptions'

import type { _AttributePutItem } from './attribute'

export type _SetAttributePutItem<_SET_ATTRIBUTE extends _SetAttribute> = _SET_ATTRIBUTE extends {
  [$required]: 'never'
}
  ? undefined | Set<_AttributePutItem<_SET_ATTRIBUTE[$elements]>>
  : Set<_AttributePutItem<_SET_ATTRIBUTE[$elements]>>
