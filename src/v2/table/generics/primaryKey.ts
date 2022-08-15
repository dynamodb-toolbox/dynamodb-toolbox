import { TableV2 } from '../class'
import { IndexableKeyType, ResolveIndexableKeyType } from '../types'

import { HasSK } from './hasSk'

export type PrimaryKey<T extends TableV2 = TableV2> = TableV2 extends T
  ? Record<string, ResolveIndexableKeyType<IndexableKeyType>>
  : HasSK<T> extends true
  ? {
      [K in
        | T['partitionKey']['name']
        | NonNullable<T['sortKey']>['name']]: K extends T['partitionKey']['name']
        ? ResolveIndexableKeyType<T['partitionKey']['type']>
        : K extends NonNullable<T['sortKey']>['name']
        ? ResolveIndexableKeyType<NonNullable<T['sortKey']>['type']>
        : never
    }
  : {
      [K in T['partitionKey']['name']]: ResolveIndexableKeyType<T['partitionKey']['type']>
    }
