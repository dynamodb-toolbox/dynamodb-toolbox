import type { _ListAttribute } from 'v1/item'

import type { _AttributePutItem } from './attribute'

export type _ListAttributePutItem<
  _LIST_ATTRIBUTE extends _ListAttribute
> = _LIST_ATTRIBUTE extends {
  _required: 'never'
}
  ? undefined | _AttributePutItem<_LIST_ATTRIBUTE['_elements']>[]
  : _AttributePutItem<_LIST_ATTRIBUTE['_elements']>[]
