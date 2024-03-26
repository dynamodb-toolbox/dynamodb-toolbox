import type { TableV2 } from '../table'
import type { IndexableKeyType, ResolveIndexableKeyType, Key } from '../types'

/**
 * Returns the TS type of a Table Primary Key
 *
 * @param TABLE Table
 * @return Object
 */
export type PrimaryKey<TABLE extends TableV2 = TableV2> = TableV2 extends TABLE
  ? Record<string, ResolveIndexableKeyType<IndexableKeyType>>
  : Key extends TABLE['sortKey']
  ? {
      [KEY in TABLE['partitionKey']['name']]: ResolveIndexableKeyType<TABLE['partitionKey']['type']>
    }
  : NonNullable<TABLE['sortKey']> extends Key
  ? {
      [KEY in
        | TABLE['partitionKey']['name']
        | NonNullable<TABLE['sortKey']>['name']]: KEY extends TABLE['partitionKey']['name']
        ? ResolveIndexableKeyType<TABLE['partitionKey']['type']>
        : KEY extends NonNullable<TABLE['sortKey']>['name']
        ? ResolveIndexableKeyType<NonNullable<TABLE['sortKey']>['type']>
        : never
    }
  : never
