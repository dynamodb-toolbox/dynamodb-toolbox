import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import type { Schema } from 'v1/schema'
import type { EntityV2 } from 'v1/entity'
import type { Condition, SchemaCondition } from 'v1/commands/types/condition'
import { ConditionParser } from 'v1/commands/classes/conditionParser'

export const parseSchemaCondition = <
  SCHEMA extends Schema,
  CONDITION extends SchemaCondition<SCHEMA>
>(
  schema: SCHEMA,
  condition: CONDITION
): {
  ConditionExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, NativeAttributeValue>
} => {
  const conditionParser = new ConditionParser(schema)
  conditionParser.parseCondition(condition)
  return conditionParser.toCommandOptions()
}

export const parseCondition = <ENTITY extends EntityV2, CONDITION extends Condition<ENTITY>>(
  entity: ENTITY,
  condition: CONDITION
): {
  ConditionExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, NativeAttributeValue>
} => parseSchemaCondition(entity.schema, condition)
