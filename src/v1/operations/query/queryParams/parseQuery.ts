import type { O } from 'ts-toolbelt'
import type { QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { ConditionParser } from 'v1/operations/expression/condition/parser'
import _pick from 'lodash.pick'

import type { Condition, Query } from 'v1/operations/types'
import type { Attribute, PrimitiveAttribute, ResolvedPrimitiveAttribute, Schema } from 'v1/schema'
import type { TableV2 } from 'v1/table'
import type { PrimitiveAttributeExtraCondition } from 'v1/operations/types/condition'
import { DynamoDBToolboxError } from 'v1/errors'
import { queryOperatorSet } from 'v1/operations/types/query'

const defaultSchema: Schema = {
  type: 'schema',
  attributes: {},
  savedAttributeNames: new Set(),
  keyAttributeNames: new Set(),
  requiredAttributeNames: {
    always: new Set(),
    atLeastOnce: new Set(),
    never: new Set()
  },
  and: undefined as any
}

const defaultAttribute: Omit<Attribute, 'path' | 'type'> = {
  required: 'never',
  key: false,
  hidden: false,
  savedAs: undefined,
  defaults: {
    key: undefined,
    put: undefined,
    update: undefined
  }
}

const pick = _pick as <OBJECT extends object, KEYS extends string[]>(
  object: OBJECT,
  keys: KEYS
) => O.Pick<OBJECT, KEYS[number]>

export const parseQuery = <TABLE extends TableV2, QUERY extends Query<TABLE>>(
  table: TABLE,
  query: QUERY
): Pick<
  QueryCommandInput,
  'KeyConditionExpression' | 'ExpressionAttributeNames' | 'ExpressionAttributeValues'
> => {
  const { index, partition, range } = query
  const { partitionKey = table.partitionKey, sortKey } =
    index !== undefined ? table.indexes[index] : table

  if (partition === undefined) {
    throw new DynamoDBToolboxError('queryCommand.invalidPartition', {
      message: `Missing query partition. Expected: ${partitionKey.type}.`,
      path: partitionKey.name,
      payload: { partition }
    })
  }

  const indexSchema: Schema = defaultSchema
  indexSchema.attributes[partitionKey.name] = {
    ...defaultAttribute,
    path: partitionKey.name,
    type: partitionKey.type,
    enum: undefined,
    transform: undefined
  }

  let condition: Condition = {
    attr: partitionKey.name,
    eq: partition
  }

  if (sortKey !== undefined && range !== undefined) {
    indexSchema.attributes[sortKey.name] = {
      ...defaultAttribute,
      path: sortKey.name,
      type: sortKey.type,
      enum: undefined,
      transform: undefined
    }

    const sortKeyCondition = ({
      attr: sortKey.name,
      ...pick(range, [...queryOperatorSet])
      /**
       * @debt type "TODO: Remove this cast"
       */
    } as unknown) as PrimitiveAttributeExtraCondition<
      string,
      PrimitiveAttribute,
      never,
      ResolvedPrimitiveAttribute
    >

    condition = {
      and: [condition, sortKeyCondition]
    }
  }

  const conditionParser = new ConditionParser(indexSchema, '0')
  conditionParser.parseCondition(condition)
  const {
    ConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  } = conditionParser.toCommandOptions()

  return {
    KeyConditionExpression: ConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  }
}
