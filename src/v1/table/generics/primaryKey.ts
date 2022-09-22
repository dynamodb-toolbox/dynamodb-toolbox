import { TableV2 } from '../class'
import { IndexableKeyType, ResolveIndexableKeyType } from '../types'

import { HasSK } from './hasSk'

/**
 * Returns the TS type of a Table Primary Key
 *
 * @param TableInput Table
 * @return Object
 */
export type PrimaryKey<TableInput extends TableV2 = TableV2> = TableV2 extends TableInput
  ? Record<string, ResolveIndexableKeyType<IndexableKeyType>>
  : HasSK<TableInput> extends true
  ? {
      [K in
        | TableInput['partitionKey']['name']
        | NonNullable<TableInput['sortKey']>['name']]: K extends TableInput['partitionKey']['name']
        ? ResolveIndexableKeyType<TableInput['partitionKey']['type']>
        : K extends NonNullable<TableInput['sortKey']>['name']
        ? ResolveIndexableKeyType<NonNullable<TableInput['sortKey']>['type']>
        : never
    }
  : {
      [K in TableInput['partitionKey']['name']]: ResolveIndexableKeyType<
        TableInput['partitionKey']['type']
      >
    }
