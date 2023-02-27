import type { O } from 'ts-toolbelt'

import type { Or } from 'v1/types/or'
import type { Item, Always } from 'v1/item'
import type { TableV2, IndexableKeyType, Key } from 'v1/table'

type NeedsKeyPartCompute<
  ITEM extends Item,
  KEY_PART_NAME extends string,
  KEY_PART_TYPE extends IndexableKeyType
> = ITEM['attributes'] extends Record<
  KEY_PART_NAME,
  { type: KEY_PART_TYPE; required: Always; key: true; savedAs: undefined }
>
  ? false
  : O.SelectKeys<
      ITEM['attributes'],
      { type: KEY_PART_TYPE; required: Always; key: true; savedAs: KEY_PART_NAME }
    > extends never
  ? true
  : false

/**
 * Wether the provided item matches the primary key of a given table
 *
 * @param ItemInput Item
 * @param TableInput Table
 * @return Boolean
 */
export type NeedsKeyCompute<ITEM extends Item, TABLE extends TableV2> = Key extends TABLE['sortKey']
  ? NeedsKeyPartCompute<ITEM, TABLE['partitionKey']['name'], TABLE['partitionKey']['type']>
  : NonNullable<TABLE['sortKey']> extends Key
  ? Or<
      NeedsKeyPartCompute<ITEM, TABLE['partitionKey']['name'], TABLE['partitionKey']['type']>,
      NeedsKeyPartCompute<
        ITEM,
        NonNullable<TABLE['sortKey']>['name'],
        NonNullable<TABLE['sortKey']>['type']
      >
    >
  : never
