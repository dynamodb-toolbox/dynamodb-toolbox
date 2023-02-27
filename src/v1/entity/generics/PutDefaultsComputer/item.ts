import type { Item } from 'v1/item'
import type { OmitUndefinedProperties } from 'v1/types'

import type { PutItemInput } from '../PutItemInput'

import type { AttributePutDefaultsComputer } from './attribute'

export type ItemPutDefaultsComputer<
  ITEM extends Item,
  ATTRIBUTES_PUT_DEFAULT_COMPUTERS = OmitUndefinedProperties<
    {
      [KEY in keyof ITEM['attributes']]: AttributePutDefaultsComputer<
        ITEM['attributes'][KEY],
        [PutItemInput<ITEM, true>]
      >
    }
  >
> = keyof ATTRIBUTES_PUT_DEFAULT_COMPUTERS extends never
  ? undefined
  : { [KEY in keyof ATTRIBUTES_PUT_DEFAULT_COMPUTERS]: ATTRIBUTES_PUT_DEFAULT_COMPUTERS[KEY] }
