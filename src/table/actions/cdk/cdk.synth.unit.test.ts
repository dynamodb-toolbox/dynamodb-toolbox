import { App, Stack, assertions, aws_dynamodb } from 'aws-cdk-lib'

import { Table } from '~/table/table.js'

import { CDKTableV2 } from './cdk.js'

describe('CDKTableV2 - CDK synth', () => {
  test('synthesizes the table key schema & secondary indexes', () => {
    const table = new Table({
      name: 'poke-table',
      partitionKey: { name: 'pk', type: 'string' },
      sortKey: { name: 'sk', type: 'number' },
      indexes: {
        byType: {
          type: 'global',
          partitionKey: { name: 'type', type: 'string' },
          sortKey: { name: 'createdAt', type: 'string' }
        },
        byMultiAttributes: {
          type: 'global',
          partitionKeys: [
            { name: 'a', type: 'string' },
            { name: 'b', type: 'number' }
          ],
          sortKeys: [
            { name: 'c', type: 'binary' },
            { name: 'd', type: 'string' }
          ]
        },
        byLevel: { type: 'local', sortKey: { name: 'level', type: 'number' } }
      }
    })

    const stack = new Stack(new App(), 'Stack')
    new aws_dynamodb.TableV2(stack, 'Table', table.build(CDKTableV2).props())

    assertions.Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TableName: 'poke-table',
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
        { AttributeName: 'sk', KeyType: 'RANGE' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'N' },
        { AttributeName: 'type', AttributeType: 'S' },
        { AttributeName: 'createdAt', AttributeType: 'S' },
        { AttributeName: 'a', AttributeType: 'S' },
        { AttributeName: 'b', AttributeType: 'N' },
        { AttributeName: 'c', AttributeType: 'B' },
        { AttributeName: 'd', AttributeType: 'S' },
        { AttributeName: 'level', AttributeType: 'N' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'byType',
          KeySchema: [
            { AttributeName: 'type', KeyType: 'HASH' },
            { AttributeName: 'createdAt', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' }
        },
        {
          IndexName: 'byMultiAttributes',
          KeySchema: [
            { AttributeName: 'a', KeyType: 'HASH' },
            { AttributeName: 'b', KeyType: 'HASH' },
            { AttributeName: 'c', KeyType: 'RANGE' },
            { AttributeName: 'd', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' }
        }
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: 'byLevel',
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'level', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' }
        }
      ]
    })
  })
})
