import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import type { Schema } from 'v1/schema'
import type { EntityV2 } from 'v1/entity'
import type { Condition, SchemaCondition } from 'v1/operations/types'

import { ConditionParser } from './parser'

export const parseSchemaCondition = <
  SCHEMA extends Schema,
  CONDITION extends SchemaCondition<SCHEMA>
>(
  schema: SCHEMA,
  condition: CONDITION,
  id?: string
): {
  ConditionExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, NativeAttributeValue>
} => {
  const conditionParser = new ConditionParser(schema, id)
  conditionParser.parseCondition(condition)
  return conditionParser.toCommandOptions()
}

export const parseCondition = <ENTITY extends EntityV2, CONDITION extends Condition<ENTITY>>(
  entity: ENTITY,
  condition: CONDITION,
  id?: string
): {
  ConditionExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, NativeAttributeValue>
} => parseSchemaCondition(entity.schema, condition, id)
