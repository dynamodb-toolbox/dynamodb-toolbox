import type { $SetAttribute, $elements, $required } from 'v1/item'

import type { $AttributePutItem } from './attribute'

export type $SetAttributePutItem<$SET_ATTRIBUTE extends $SetAttribute> = $SET_ATTRIBUTE extends {
  [$required]: 'never'
}
  ? undefined | Set<$AttributePutItem<$SET_ATTRIBUTE[$elements]>>
  : Set<$AttributePutItem<$SET_ATTRIBUTE[$elements]>>
