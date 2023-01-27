import type { _ListAttribute } from 'v1/item'
import type { $elements, $required } from 'v1/item/attributes/constants/attributeOptions'

import type { _AttributePutItem } from './attribute'

export type _ListAttributePutItem<
  _LIST_ATTRIBUTE extends _ListAttribute
> = _LIST_ATTRIBUTE extends {
  [$required]: 'never'
}
  ? undefined | _AttributePutItem<_LIST_ATTRIBUTE[$elements]>[]
  : _AttributePutItem<_LIST_ATTRIBUTE[$elements]>[]
