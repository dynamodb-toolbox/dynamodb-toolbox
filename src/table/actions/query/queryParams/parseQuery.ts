import type { QueryCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from '~/errors/index.js'
import { ConditionParser } from '~/schema/actions/parseCondition/index.js'
import type { SchemaCondition } from '~/schema/actions/parseCondition/index.js'
import { BinarySchema } from '~/schema/binary/schema.js'
import type { Schema } from '~/schema/index.js'
import { ItemSchema } from '~/schema/item/schema.js'
import { NumberSchema } from '~/schema/number/schema.js'
import { StringSchema } from '~/schema/string/schema.js'
import type { Table } from '~/table/index.js'
import type { Index, IndexableKeyType, Key } from '~/table/types/index.js'
import { pick } from '~/utils/pick.js'

import type { QueryOperator } from '../types.js'
import type { Query } from '../types.js'

type QueryParser = <TABLE extends Table, QUERY extends Query<TABLE>>(
  table: TABLE,
  query: QUERY
) => Pick<
  QueryCommandInput,
  'KeyConditionExpression' | 'ExpressionAttributeNames' | 'ExpressionAttributeValues'
>

const queryOperatorSet = new Set<QueryOperator>([
  'eq',
  'gt',
  'gte',
  'lt',
  'lte',
  'between',
  'beginsWith'
])

const getIndexKeySchema = (key: Key<string, IndexableKeyType>): Schema => {
  switch (key.type) {
    case 'number':
      return new NumberSchema({ required: 'never', big: true })
    case 'string':
      return new StringSchema({ required: 'never' })
    case 'binary':
      return new BinarySchema({ required: 'never' })
  }
}

export const parseQuery: QueryParser = (table, query) => {
  const { index, partition, range } = query

  let primaryKeySchema: Index | Table

  if (index !== undefined) {
    const indexKeySchema = table.indexes[index]

    if (indexKeySchema === undefined) {
      const indexes = Object.keys(table.indexes)
      const hasIndex = indexes.length > 0

      throw new DynamoDBToolboxError('queryCommand.invalidIndex', {
        message: `Unknown index: ${index}. ${hasIndex ? ` Expected one of: ${indexes.join(', ')}.` : ''}`,
        payload: { received: index, ...(hasIndex ? { expected: Object.keys(table.indexes) } : {}) }
      })
    }

    primaryKeySchema = indexKeySchema
  } else {
    primaryKeySchema = table
  }

  const { partitionKey = table.partitionKey, sortKey } = primaryKeySchema

  if (partition === undefined) {
    throw new DynamoDBToolboxError('queryCommand.invalidPartition', {
      message: `Missing query partition. Expected: ${partitionKey.type}.`,
      path: partitionKey.name,
      payload: { partition }
    })
  }

  const indexSchema = new ItemSchema({
    [partitionKey.name]: getIndexKeySchema(partitionKey),
    ...(sortKey !== undefined && range !== undefined
      ? { [sortKey.name]: getIndexKeySchema(sortKey) }
      : {})
  })

  let condition = { attr: partitionKey.name, eq: partition } as SchemaCondition

  if (sortKey !== undefined && range !== undefined) {
    const sortKeyCondition = {
      attr: sortKey.name,
      ...pick(range, ...queryOperatorSet)
    } as SchemaCondition

    condition = { and: [condition, sortKeyCondition] }
  }

  const conditionParser = new ConditionParser(indexSchema)
  const { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
    conditionParser.parse(condition, { expressionId: '0' })

  return {
    KeyConditionExpression: ConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  }
}
