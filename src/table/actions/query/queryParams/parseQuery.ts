import type { QueryCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from '~/errors/index.js'
import type { SchemaCondition } from '~/schema/actions/parseCondition/index.js'
import { ConditionParser } from '~/schema/actions/parseCondition/index.js'
import { BinarySchema } from '~/schema/binary/schema.js'
import type { Schema } from '~/schema/index.js'
import { ItemSchema } from '~/schema/item/schema.js'
import { NumberSchema } from '~/schema/number/schema.js'
import { StringSchema } from '~/schema/string/schema.js'
import { Table } from '~/table/index.js'
import type { Index, Key } from '~/table/types/index.js'
import { pick } from '~/utils/pick.js'
import { isArray } from '~/utils/validation/isArray.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { Query, QueryOperator } from '../types.js'

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

const getIndexKeySchema = (key: Key): Schema => {
  switch (key.type) {
    case 'number':
      return new NumberSchema({ big: true })
    case 'string':
      return new StringSchema({})
    case 'binary':
      return new BinarySchema({})
  }
}

export const parseQuery: QueryParser = (table, query) => {
  const queryIndex = getQueryIndex(table, query)
  const { partitionKeys, sortKeys } = flattenQuerySchema(table, queryIndex)

  const { partition, range } = query
  const isPartitionArray = isArray(partition)
  const hasRange = range !== undefined
  const isRangeArray = hasRange && isArray(range)

  if (!(queryIndex instanceof Table) && queryIndex.type === 'global') {
    if ('partitionKeys' in queryIndex && !isPartitionArray) {
      throw new DynamoDBToolboxError('queryCommand.invalidPartition', {
        message: 'Invalid query partition. Expected: Array.',
        payload: { partition }
      })
    }

    if (hasRange && 'sortKeys' in queryIndex && !isRangeArray) {
      throw new DynamoDBToolboxError('queryCommand.invalidRange', {
        message: 'Invalid query range. Expected: Array.',
        payload: { range }
      })
    }
  }

  const partitions = isPartitionArray ? partition : [partition]
  if (partitions.length !== partitionKeys.length) {
    throw new DynamoDBToolboxError('queryCommand.invalidPartition', {
      message: `Invalid number of query partitions. Expected: ${partitionKeys.length}.`,
      payload: { partition: partitions }
    })
  }

  const ranges = hasRange ? (isRangeArray ? range : [range]) : []
  if (ranges.length > sortKeys.length) {
    throw new DynamoDBToolboxError('queryCommand.invalidRange', {
      message: `Invalid number of query ranges. Expected: Less than or equal to ${sortKeys.length}.`,
      payload: { range: ranges }
    })
  }

  const keyConditions: SchemaCondition[] = []

  let partitionIndex = 0
  for (const partition of partitions) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    keyConditions.push({ attr: partitionKeys[partitionIndex]!.name, eq: partition })
    partitionIndex++
  }

  if (hasRange) {
    let hasRangeObject = false
    let rangeIndex = 0
    for (const range of ranges) {
      if (hasRangeObject) {
        throw new DynamoDBToolboxError('queryCommand.invalidRange', {
          message: 'Invalid query range: Range object must be provided last.',
          payload: { range }
        })
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const sortKey = sortKeys[rangeIndex]!

      if (isObject(range)) {
        keyConditions.push({
          attr: sortKey.name,
          ...pick(range, ...queryOperatorSet)
        } as SchemaCondition)
        hasRangeObject = true
      } else {
        keyConditions.push({ attr: sortKey.name, eq: range })
      }
      rangeIndex++
    }
  }

  const indexSchema = new ItemSchema(
    Object.fromEntries(
      [...partitionKeys, ...sortKeys].map(key => [key.name, getIndexKeySchema(key)])
    )
  )

  const conditionParser = new ConditionParser(indexSchema)
  const { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
    conditionParser.parse({ and: keyConditions }, { expressionId: '0' })

  return {
    KeyConditionExpression: ConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  }
}

const getQueryIndex = (table: Table, { index }: Query): Table | Index => {
  if (index === undefined) {
    return table
  }

  const indexSchema = table.indexes[index]

  if (indexSchema === undefined) {
    const indexes = Object.keys(table.indexes)
    const hasIndex = indexes.length > 0

    throw new DynamoDBToolboxError('queryCommand.invalidIndex', {
      message: `Unknown index: ${index}. ${hasIndex ? ` Expected one of: ${indexes.join(', ')}.` : ''}`,
      payload: { received: index, ...(hasIndex ? { expected: indexes } : {}) }
    })
  }

  return indexSchema
}

const flattenQuerySchema = (
  table: Table,
  queryIndex: Table | Index
): { partitionKeys: readonly Key[]; sortKeys: readonly Key[] } => {
  if (queryIndex instanceof Table) {
    return {
      partitionKeys: [queryIndex.partitionKey],
      sortKeys: queryIndex.sortKey ? [queryIndex.sortKey] : []
    }
  }

  switch (queryIndex.type) {
    case 'global':
      return {
        partitionKeys: queryIndex.partitionKeys ?? [queryIndex.partitionKey],
        sortKeys: queryIndex.sortKeys
          ? queryIndex.sortKeys
          : queryIndex.sortKey
            ? [queryIndex.sortKey]
            : []
      }
    case 'local':
      return {
        partitionKeys: [table.partitionKey],
        sortKeys: [queryIndex.sortKey]
      }
  }
}
