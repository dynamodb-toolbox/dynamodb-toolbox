import type { _Item } from 'v1/item'
import type { OmitUndefinedProperties } from 'v1/types'
import type { $attributes } from 'v1/item/attributes/constants/attributeOptions'

import type { _PutItemInput } from '../PutItemInput'

import type { _AttributePutDefaultsComputer } from './attribute'

export type _ItemPutDefaultsComputer<
  _ITEM extends _Item,
  _ATTRIBUTES_PUT_DEFAULT_COMPUTERS = OmitUndefinedProperties<
    {
      [KEY in keyof _ITEM[$attributes]]: _AttributePutDefaultsComputer<
        _ITEM[$attributes][KEY],
        [_PutItemInput<_ITEM, true>]
      >
    }
  >
> = keyof _ATTRIBUTES_PUT_DEFAULT_COMPUTERS extends never
  ? undefined
  : { [KEY in keyof _ATTRIBUTES_PUT_DEFAULT_COMPUTERS]: _ATTRIBUTES_PUT_DEFAULT_COMPUTERS[KEY] }
