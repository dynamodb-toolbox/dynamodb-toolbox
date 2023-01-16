import type {
  _Attribute,
  _AnyAttribute,
  _ConstantAttribute,
  _PrimitiveAttribute,
  _SetAttribute,
  _ListAttribute,
  _MapAttribute
} from 'v1/item'

import type { _AnyAttributePutItem } from './any'
import type { _ConstantAttributePutItem } from './constant'
import type { _PrimitiveAttributePutItem } from './primitive'
import type { _SetAttributePutItem } from './set'
import type { _ListAttributePutItem } from './list'
import type { _MapAttributePutItem } from './map'

export type _AttributePutItem<_ATTRIBUTE extends _Attribute> = _ATTRIBUTE extends _AnyAttribute
  ? _AnyAttributePutItem<_ATTRIBUTE>
  : _ATTRIBUTE extends _ConstantAttribute
  ? _ConstantAttributePutItem<_ATTRIBUTE>
  : _ATTRIBUTE extends _PrimitiveAttribute
  ? _PrimitiveAttributePutItem<_ATTRIBUTE>
  : _ATTRIBUTE extends _SetAttribute
  ? _SetAttributePutItem<_ATTRIBUTE>
  : _ATTRIBUTE extends _ListAttribute
  ? _ListAttributePutItem<_ATTRIBUTE>
  : _ATTRIBUTE extends _MapAttribute
  ? _MapAttributePutItem<_ATTRIBUTE>
  : never
