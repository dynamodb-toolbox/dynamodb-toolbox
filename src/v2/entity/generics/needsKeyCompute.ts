import type { O } from 'ts-toolbelt'

import type { Item, Always } from 'v2/item'
import type { TableV2, IndexableKeyType, HasSK } from 'v2/table'

type Or<A extends boolean, B extends boolean> = A extends true
  ? true
  : B extends true
  ? true
  : false

type NeedsKeyPartCompute<
  I extends Item,
  N extends string,
  T extends IndexableKeyType
> = I['_properties'] extends Record<
  N,
  { _type: T; _required: Always; _key: true; _savedAs: undefined }
>
  ? false
  : O.SelectKeys<
      I['_properties'],
      { _type: T; _required: Always; _key: true; _savedAs: N }
    > extends never
  ? true
  : false

export type NeedsKeyCompute<I extends Item, T extends TableV2> = HasSK<T> extends true
  ? Or<
      NeedsKeyPartCompute<I, T['partitionKey']['name'], T['partitionKey']['type']>,
      NeedsKeyPartCompute<I, NonNullable<T['sortKey']>['name'], NonNullable<T['sortKey']>['type']>
    >
  : NeedsKeyPartCompute<I, T['partitionKey']['name'], T['partitionKey']['type']>
