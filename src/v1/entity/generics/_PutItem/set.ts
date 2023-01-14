import type { _SetAttribute } from 'v1/item'

import type { _AttributePutItem } from './attribute'

export type _SetAttributePutItem<_SET_ATTRIBUTE extends _SetAttribute> = _SET_ATTRIBUTE extends {
  _required: 'never'
}
  ? undefined | Set<_AttributePutItem<_SET_ATTRIBUTE['_elements']>>
  : Set<_AttributePutItem<_SET_ATTRIBUTE['_elements']>>
