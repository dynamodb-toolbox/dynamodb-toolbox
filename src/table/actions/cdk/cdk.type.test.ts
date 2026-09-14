import type { TablePropsV2 } from 'aws-cdk-lib/aws-dynamodb'
import type { A } from 'ts-toolbelt'

import { Table } from '~/table/table.js'

import { CDKTableV2 } from './cdk.js'
import type { CDKTableV2Props } from './cdk.js'

const table = new Table({
  name: 'poke-table',
  partitionKey: { name: 'pk', type: 'string' },
  sortKey: { name: 'sk', type: 'number' },
  indexes: { gsi: { type: 'global', partitionKey: { name: 'gsipk', type: 'string' } } }
})
const cdkTable = table.build(CDKTableV2)

const props = cdkTable.props()
const assertProps: A.Equals<typeof props, CDKTableV2Props> = 1
assertProps

const assertAssignableToTableProps: A.Extends<CDKTableV2Props, TablePropsV2> = 1
assertAssignableToTableProps

const tableProps: TablePropsV2 = { ...cdkTable.props({ tableName: true }) }
tableProps

// @ts-expect-error `tableName` option is a boolean
cdkTable.props({ tableName: 'poke-table' })

// @ts-expect-error unknown options are rejected
cdkTable.props({ unknownOption: true })
