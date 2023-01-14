import type {
  ComputedDefault,
  _Attribute,
  _AnyAttribute,
  _PrimitiveAttribute,
  _SetAttribute,
  _ListAttribute,
  _MapAttribute
} from 'v1/item'

import type { _AttributePutItem } from '../_PutItem'

import type { _ListAttributePutDefaultsComputer } from './list'
import type { _MapAttributePutDefaultsComputer } from './map'

export type _AttributePutDefaultsComputer<
  _ATTRIBUTE extends _Attribute,
  CONTEXT_INPUTS extends any[]
> = _ATTRIBUTE extends (_AnyAttribute | _PrimitiveAttribute | _SetAttribute) & {
  _default: ComputedDefault
}
  ? (...contextInputs: CONTEXT_INPUTS) => _AttributePutItem<_ATTRIBUTE>
  : _ATTRIBUTE extends _ListAttribute
  ? _ListAttributePutDefaultsComputer<_ATTRIBUTE, CONTEXT_INPUTS>
  : _ATTRIBUTE extends _MapAttribute
  ? _MapAttributePutDefaultsComputer<_ATTRIBUTE, CONTEXT_INPUTS>
  : undefined
