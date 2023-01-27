import type { O } from 'ts-toolbelt'

import type { _Item, Always } from 'v1/item'
import type {
  $type,
  $attributes,
  $required,
  $key,
  $savedAs
} from 'v1/item/attributes/constants/attributeOptions'
import type { TableV2, IndexableKeyType, HasSK } from 'v1/table'

type Or<BOOL_A extends boolean, BOOL_B extends boolean> = BOOL_A extends true
  ? true
  : BOOL_B extends true
  ? true
  : false

type _NeedsKeyPartCompute<
  _ITEM extends _Item,
  KEY_PART_NAME extends string,
  KEY_PART_TYPE extends IndexableKeyType
> = _ITEM[$attributes] extends Record<
  KEY_PART_NAME,
  { [$type]: KEY_PART_TYPE; [$required]: Always; [$key]: true; [$savedAs]: undefined }
>
  ? false
  : O.SelectKeys<
      _ITEM[$attributes],
      { [$type]: KEY_PART_TYPE; [$required]: Always; [$key]: true; [$savedAs]: KEY_PART_NAME }
    > extends never
  ? true
  : false

// TODO: Required in Entity constructor... See if possible to use only PutItem
/**
 * Wether the provided item matches the primary key of a given table
 *
 * @param ItemInput Item
 * @param TableInput Table
 * @return Boolean
 */
export type _NeedsKeyCompute<_ITEM extends _Item, TABLE extends TableV2> = HasSK<TABLE> extends true
  ? Or<
      _NeedsKeyPartCompute<_ITEM, TABLE['partitionKey']['name'], TABLE['partitionKey']['type']>,
      _NeedsKeyPartCompute<
        _ITEM,
        NonNullable<TABLE['sortKey']>['name'],
        NonNullable<TABLE['sortKey']>['type']
      >
    >
  : _NeedsKeyPartCompute<_ITEM, TABLE['partitionKey']['name'], TABLE['partitionKey']['type']>
