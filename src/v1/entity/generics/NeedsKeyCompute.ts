import type { O } from 'ts-toolbelt'

import type { Item, Always } from 'v1/item'
import type { TableV2, IndexableKeyType, HasSK } from 'v1/table'

type Or<PropositionA extends boolean, PropositionB extends boolean> = PropositionA extends true
  ? true
  : PropositionB extends true
  ? true
  : false

type NeedsKeyPartCompute<
  ItemInput extends Item,
  KeyName extends string,
  KeyType extends IndexableKeyType
> = ItemInput['_attributes'] extends Record<
  KeyName,
  { _type: KeyType; _required: Always; _key: true; _savedAs: undefined }
>
  ? false
  : O.SelectKeys<
      ItemInput['_attributes'],
      { _type: KeyType; _required: Always; _key: true; _savedAs: KeyName }
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
export type NeedsKeyCompute<
  ItemInput extends Item,
  TableInput extends TableV2
> = HasSK<TableInput> extends true
  ? Or<
      NeedsKeyPartCompute<
        ItemInput,
        TableInput['partitionKey']['name'],
        TableInput['partitionKey']['type']
      >,
      NeedsKeyPartCompute<
        ItemInput,
        NonNullable<TableInput['sortKey']>['name'],
        NonNullable<TableInput['sortKey']>['type']
      >
    >
  : NeedsKeyPartCompute<
      ItemInput,
      TableInput['partitionKey']['name'],
      TableInput['partitionKey']['type']
    >
