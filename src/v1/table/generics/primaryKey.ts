import { TableV2 } from '../class'
import { IndexableKeyType, ResolveIndexableKeyType } from '../types'

import { HasSK } from './hasSk'

/**
 * Returns the TS type of a Table Primary Key
 *
 * @param TableInput Table
 * @return Object
 */
export type PrimaryKey<TABLE extends TableV2 = TableV2> = TableV2 extends TABLE
  ? Record<string, ResolveIndexableKeyType<IndexableKeyType>>
  : HasSK<TABLE> extends true
  ? {
      [K in
        | TABLE['partitionKey']['name']
        | NonNullable<TABLE['sortKey']>['name']]: K extends TABLE['partitionKey']['name']
        ? ResolveIndexableKeyType<TABLE['partitionKey']['type']>
        : K extends NonNullable<TABLE['sortKey']>['name']
        ? ResolveIndexableKeyType<NonNullable<TABLE['sortKey']>['type']>
        : never
    }
  : {
      [K in TABLE['partitionKey']['name']]: ResolveIndexableKeyType<TABLE['partitionKey']['type']>
    }
