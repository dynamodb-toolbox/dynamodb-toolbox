import type {
  Attribute,
  AttributeType,
  GlobalSecondaryIndexPropsV2,
  LocalSecondaryIndexProps,
  TablePropsV2
} from 'aws-cdk-lib/aws-dynamodb'

import { TableAction } from '~/table/index.js'
import type { Table } from '~/table/table.js'
import type { GlobalIndex, Index, Key, KeyType, LocalIndex } from '~/table/types/index.js'
import { isString } from '~/utils/validation/isString.js'

/** Options of the `CDKTableV2` `props` method. */
export interface CDKTableV2Options {
  /**
   * Whether to emit `tableName`: `true` resolves it (throws if the `Table` has no name), `false` omits it.
   * By default, only static (string) names are emitted.
   */
  tableName?: boolean
}

/** AWS CDK `TableV2` props derived from a `Table`: keys, secondary indexes and (optionally) table name. */
export type CDKTableV2Props = Pick<
  TablePropsV2,
  'tableName' | 'partitionKey' | 'sortKey' | 'globalSecondaryIndexes' | 'localSecondaryIndexes'
>

const cdkAttributeTypes = {
  string: 'S',
  number: 'N',
  binary: 'B'
} as const satisfies Record<KeyType, `${AttributeType}`>

const toCDKAttribute = ({ name, type }: Key): Attribute => ({
  name,
  type: cdkAttributeTypes[type] as AttributeType
})

const toCDKKeys = (
  key: Key | undefined,
  keys: readonly Key[] | undefined
): { key?: Attribute; keys?: Attribute[] } => {
  if (key !== undefined) {
    return { key: toCDKAttribute(key) }
  }

  if (keys === undefined) {
    return {}
  }

  const [firstKey, ...otherKeys] = keys

  // Multi-attribute keys (plural props) are only supported by aws-cdk-lib >= 2.226
  return firstKey !== undefined && otherKeys.length === 0
    ? { key: toCDKAttribute(firstKey) }
    : { keys: keys.map(toCDKAttribute) }
}

const toGlobalIndexProps = (indexName: string, index: GlobalIndex): GlobalSecondaryIndexPropsV2 => {
  const { key: partitionKey, keys: partitionKeys } = toCDKKeys(
    index.partitionKey,
    index.partitionKeys
  )
  const { key: sortKey, keys: sortKeys } = toCDKKeys(index.sortKey, index.sortKeys)

  return {
    indexName,
    ...(partitionKey !== undefined ? { partitionKey } : {}),
    ...(partitionKeys !== undefined ? { partitionKeys } : {}),
    ...(sortKey !== undefined ? { sortKey } : {}),
    ...(sortKeys !== undefined ? { sortKeys } : {})
  }
}

const toLocalIndexProps = (indexName: string, index: LocalIndex): LocalSecondaryIndexProps => ({
  indexName,
  sortKey: toCDKAttribute(index.sortKey)
})

const getCDKTableName = (
  table: Table,
  tableNameOption: boolean | undefined
): string | undefined => {
  switch (tableNameOption) {
    case true:
      return table.getName()
    case false:
      return undefined
    default:
      return isString(table.tableName) ? table.tableName : undefined
  }
}

/** Derive AWS CDK `TableV2` props from a `Table`, making it the single source of truth for keys and indexes. */
export class CDKTableV2<TABLE extends Table = Table> extends TableAction<TABLE> {
  static override actionName = 'cdk' as const

  /** Build the props to spread into `new TableV2(...)`. */
  props({ tableName: tableNameOption }: CDKTableV2Options = {}): CDKTableV2Props {
    const indexes: Record<string, Index> = this.table.indexes
    const globalSecondaryIndexes: GlobalSecondaryIndexPropsV2[] = []
    const localSecondaryIndexes: LocalSecondaryIndexProps[] = []

    for (const [indexName, index] of Object.entries(indexes)) {
      if (index.type === 'global') {
        globalSecondaryIndexes.push(toGlobalIndexProps(indexName, index))
      } else {
        localSecondaryIndexes.push(toLocalIndexProps(indexName, index))
      }
    }

    const tableName = getCDKTableName(this.table, tableNameOption)
    const sortKey: Key | undefined = this.table.sortKey

    return {
      ...(tableName !== undefined ? { tableName } : {}),
      partitionKey: toCDKAttribute(this.table.partitionKey),
      ...(sortKey !== undefined ? { sortKey: toCDKAttribute(sortKey) } : {}),
      ...(globalSecondaryIndexes.length > 0 ? { globalSecondaryIndexes } : {}),
      ...(localSecondaryIndexes.length > 0 ? { localSecondaryIndexes } : {})
    }
  }
}
