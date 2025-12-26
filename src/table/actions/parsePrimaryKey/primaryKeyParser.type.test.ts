import type { A } from 'ts-toolbelt'

import { Table } from '~/index.js'
import type { KeyValue } from '~/table/types/index.js'

import type { PrimaryKey } from './primaryKeyParser.js'

type AnyPrimaryKey = PrimaryKey<Table>
const assertAnyPrimaryKey: A.Equals<AnyPrimaryKey, { [x: string]: KeyValue }> = 1
assertAnyPrimaryKey

const PartitionKeyTable = new Table({
  partitionKey: { name: 'pk', type: 'string' }
})

type PartitionKeyPrimaryKey = PrimaryKey<typeof PartitionKeyTable>
const assertPartitionKey: A.Equals<PartitionKeyPrimaryKey, { pk: string }> = 1
assertPartitionKey

const SortKeyTable = new Table({
  name: 'super-table',
  partitionKey: { name: 'pk', type: 'string' },
  sortKey: { name: 'sk', type: 'number' }
})

type SortKeyPrimaryKey = PrimaryKey<typeof SortKeyTable>
const assertSortKey: A.Equals<SortKeyPrimaryKey, { pk: string; sk: number | bigint }> = 1
assertSortKey
