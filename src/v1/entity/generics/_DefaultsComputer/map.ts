import type { ComputedDefault, _MapAttribute } from 'v1/item'
import type { OmitUndefinedProperties } from 'v1/types'
import type { $attributes, $default } from 'v1/item/attributes/constants/symbols'

import type { _AttributePutItem } from '../_PutItem'
import type { _PutItemInput } from '../PutItemInput'

import type { _AttributePutDefaultsComputer } from './attribute'

export type _MapAttributePutDefaultsComputer<
  _MAP_ATTRIBUTE extends _MapAttribute,
  CONTEXT_INPUTS extends any[],
  _ATTRIBUTES_DEFAULT_COMPUTERS = OmitUndefinedProperties<
    {
      [KEY in keyof _MAP_ATTRIBUTE[$attributes]]: _AttributePutDefaultsComputer<
        _MAP_ATTRIBUTE[$attributes][KEY],
        [_PutItemInput<_MAP_ATTRIBUTE>, ...CONTEXT_INPUTS]
      >
    }
  >,
  _MAP_ATTRIBUTE_DEFAULT_COMPUTER = OmitUndefinedProperties<{
    _attributes: keyof _ATTRIBUTES_DEFAULT_COMPUTERS extends never
      ? undefined
      : {
          [KEY in keyof _ATTRIBUTES_DEFAULT_COMPUTERS]: _ATTRIBUTES_DEFAULT_COMPUTERS[KEY]
        }
    _map: _MAP_ATTRIBUTE extends { [$default]: ComputedDefault }
      ? (...contextInputs: CONTEXT_INPUTS) => _AttributePutItem<_MAP_ATTRIBUTE>
      : undefined
  }>
> = keyof _MAP_ATTRIBUTE_DEFAULT_COMPUTER extends never
  ? undefined
  : _MAP_ATTRIBUTE_DEFAULT_COMPUTER extends { _map: unknown; _attributes?: undefined }
  ? _MAP_ATTRIBUTE_DEFAULT_COMPUTER['_map']
  : { [KEY in keyof _MAP_ATTRIBUTE_DEFAULT_COMPUTER]: _MAP_ATTRIBUTE_DEFAULT_COMPUTER[KEY] }
