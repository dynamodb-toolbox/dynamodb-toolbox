import type { ComputedDefault, $MapAttribute } from 'v1/item'
import type { OmitUndefinedProperties } from 'v1/types'
import type { $attributes, $default } from 'v1/item/attributes/constants/attributeOptions'

import type { $AttributePutItem } from '../$PutItem'
import type { $AttributePutItemInput } from '../PutItemInput'

import type { $AttributePutDefaultsComputer } from './attribute'

export type $MapAttributePutDefaultsComputer<
  $MAP_ATTRIBUTE extends $MapAttribute,
  CONTEXT_INPUTS extends any[],
  $ATTRIBUTES_DEFAULT_COMPUTERS = OmitUndefinedProperties<
    {
      [KEY in keyof $MAP_ATTRIBUTE[$attributes]]: $AttributePutDefaultsComputer<
        $MAP_ATTRIBUTE[$attributes][KEY],
        [$AttributePutItemInput<$MAP_ATTRIBUTE>, ...CONTEXT_INPUTS]
      >
    }
  >,
  $MAP_ATTRIBUTE_DEFAULT_COMPUTER = OmitUndefinedProperties<{
    _attributes: keyof $ATTRIBUTES_DEFAULT_COMPUTERS extends never
      ? undefined
      : {
          [KEY in keyof $ATTRIBUTES_DEFAULT_COMPUTERS]: $ATTRIBUTES_DEFAULT_COMPUTERS[KEY]
        }
    _map: $MAP_ATTRIBUTE extends { [$default]: ComputedDefault }
      ? (...contextInputs: CONTEXT_INPUTS) => $AttributePutItem<$MAP_ATTRIBUTE>
      : undefined
  }>
> = keyof $MAP_ATTRIBUTE_DEFAULT_COMPUTER extends never
  ? undefined
  : $MAP_ATTRIBUTE_DEFAULT_COMPUTER extends { _map: unknown; _attributes?: undefined }
  ? $MAP_ATTRIBUTE_DEFAULT_COMPUTER['_map']
  : { [KEY in keyof $MAP_ATTRIBUTE_DEFAULT_COMPUTER]: $MAP_ATTRIBUTE_DEFAULT_COMPUTER[KEY] }
