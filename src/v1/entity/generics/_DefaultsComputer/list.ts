import type { ComputedDefault, _ListAttribute } from 'v1/item'
import type { OmitUndefinedProperties } from 'v1/types'
import type { $elements, $default } from 'v1/item/attributes/constants/attributeOptions'

import type { _AttributePutItem } from '../_PutItem'

import type { _AttributePutDefaultsComputer } from './attribute'

export type _ListAttributePutDefaultsComputer<
  _LIST_ATTRIBUTE extends _ListAttribute,
  CONTEXT_INPUTS extends any[],
  _ELEMENTS_DEFAULT_COMPUTER = _AttributePutDefaultsComputer<
    _LIST_ATTRIBUTE[$elements],
    [number, ...CONTEXT_INPUTS]
  >,
  _LIST_ATTRIBUTE_DEFAULT_COMPUTER = OmitUndefinedProperties<{
    _list: _LIST_ATTRIBUTE extends { [$default]: ComputedDefault }
      ? (...contextInputs: CONTEXT_INPUTS) => _AttributePutItem<_LIST_ATTRIBUTE>
      : undefined
    _elements: _ELEMENTS_DEFAULT_COMPUTER extends undefined
      ? undefined
      : _ELEMENTS_DEFAULT_COMPUTER extends { _elements: unknown }
      ? _ELEMENTS_DEFAULT_COMPUTER['_elements']
      : _ELEMENTS_DEFAULT_COMPUTER extends { _attributes: unknown }
      ? _ELEMENTS_DEFAULT_COMPUTER['_attributes']
      : never
  }>
> = keyof _LIST_ATTRIBUTE_DEFAULT_COMPUTER extends never
  ? undefined
  : _LIST_ATTRIBUTE_DEFAULT_COMPUTER extends { _list: unknown; _elements?: undefined }
  ? _LIST_ATTRIBUTE_DEFAULT_COMPUTER['_list']
  : { [KEY in keyof _LIST_ATTRIBUTE_DEFAULT_COMPUTER]: _LIST_ATTRIBUTE_DEFAULT_COMPUTER[KEY] }
