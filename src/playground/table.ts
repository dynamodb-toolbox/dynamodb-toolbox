/* eslint-disable @typescript-eslint/no-unused-vars */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import type { Query } from '~/index.js'

import { TableV2, EntityAttributeSavedAs, PrimaryKey, IndexNames, IndexSchema } from '~/index.js'

const dynamoDbClient = new DynamoDBClient({})

const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)

export const MyTable = new TableV2({
  name: 'MySuperTable',
  partitionKey: {
    name: 'userId',
    type: 'string'
  },
  sortKey: {
    name: 'sk',
    type: 'number'
  },
  documentClient,
  indexes: {
    lsi: {
      type: 'local',
      sortKey: {
        name: 'lsi_sk',
        type: 'string'
      }
    },
    gsi: {
      type: 'global',
      partitionKey: {
        name: 'GSI1_PK',
        type: 'string'
      },
      sortKey: {
        name: 'GSI1_SK',
        type: 'binary'
      }
    }
  }
})

type PK = PrimaryKey<typeof MyTable>
type EntityAttrSavedAs = EntityAttributeSavedAs<typeof MyTable>
type AllIndexes = IndexNames<typeof MyTable>
type LSI = IndexSchema<typeof MyTable, 'lsi'>
type GSI = IndexSchema<typeof MyTable, 'gsi'>
type AnyQuery = Query<typeof MyTable>
