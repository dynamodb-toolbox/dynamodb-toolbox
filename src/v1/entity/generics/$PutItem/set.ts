import type { $SetAttribute } from 'v1/item'
import type { $elements, $required } from 'v1/item/attributes/constants/attributeOptions'

import type { $AttributePutItem } from './attribute'

export type $SetAttributePutItem<$SET_ATTRIBUTE extends $SetAttribute> = $SET_ATTRIBUTE extends {
  [$required]: 'never'
}
  ? undefined | Set<$AttributePutItem<$SET_ATTRIBUTE[$elements]>>
  : Set<$AttributePutItem<$SET_ATTRIBUTE[$elements]>>
