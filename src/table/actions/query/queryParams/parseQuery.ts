import type { QueryCommandInput } from '@aws-sdk/lib-dynamodb'

import type { Never } from '~/attributes/constants/requiredOptions.js'
import { NumberAttribute } from '~/attributes/number/index.js'
import { PrimitiveAttribute } from '~/attributes/primitive/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { ConditionParser } from '~/schema/actions/parseCondition/index.js'
import type { SchemaCondition } from '~/schema/actions/parseCondition/index.js'
import { Schema } from '~/schema/index.js'
import type { Table } from '~/table/index.js'
import type { Index } from '~/table/types/indexes.js'
import { pick } from '~/utils/pick.js'

import { queryOperatorSet } from '../types.js'
import type { Query } from '../types.js'

const defaultAttribute = {
  required: 'never' as Never,
  key: false,
  hidden: false,
  savedAs: undefined,
  enum: undefined,
  transform: undefined,
  defaults: { key: undefined, put: undefined, update: undefined },
  links: { key: undefined, put: undefined, update: undefined },
  validators: { key: undefined, put: undefined, update: undefined }
}

type QueryParser = <TABLE extends Table, QUERY extends Query<TABLE>>(
  table: TABLE,
  query: QUERY
) => Pick<
  QueryCommandInput,
  'KeyConditionExpression' | 'ExpressionAttributeNames' | 'ExpressionAttributeValues'
>

export const parseQuery: QueryParser = (table, query) => {
  const { index, partition, range } = query

  let primaryKeySchema: Index | Table

  if (index !== undefined) {
    const indexKeySchema = table.indexes[index]

    if (indexKeySchema === undefined) {
      const indexes = Object.keys(table.indexes)
      const hasIndex = indexes.length > 0

      throw new DynamoDBToolboxError('queryCommand.invalidIndex', {
        message: `Inknown index: ${index}. ${hasIndex ? ` Expected one of: ${indexes.join(', ')}.` : ''}`,
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

  const indexSchema: Schema = new Schema<{}>({})
  indexSchema.attributes[partitionKey.name] =
    partitionKey.type === 'number'
      ? new NumberAttribute({ ...defaultAttribute, path: partitionKey.name })
      : new PrimitiveAttribute({
          ...defaultAttribute,
          path: partitionKey.name,
          type: partitionKey.type
        })

  let condition = {
    attr: partitionKey.name,
    eq: partition
  } as SchemaCondition

  if (sortKey !== undefined && range !== undefined) {
    indexSchema.attributes[sortKey.name] =
      sortKey.type === 'number'
        ? new NumberAttribute({ ...defaultAttribute, path: partitionKey.name })
        : new PrimitiveAttribute({ ...defaultAttribute, path: sortKey.name, type: sortKey.type })

    const sortKeyCondition = {
      attr: sortKey.name,
      ...pick(range, ...queryOperatorSet)
    } as SchemaCondition

    condition = { and: [condition, sortKeyCondition] }
  }

  const conditionParser = new ConditionParser(indexSchema, '0')
  conditionParser.parse(condition)
  const { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
    conditionParser.toCommandOptions()

  return {
    KeyConditionExpression: ConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  }
}
