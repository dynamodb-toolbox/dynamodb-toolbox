import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import type { Schema } from 'v1/schema'
import type { Condition } from 'v1/commands/types/condition'
import { ConditionParser } from 'v1/commands/classes/conditionParser'

export const parseCondition = <SCHEMA extends Schema, CONDITION extends Condition<SCHEMA>>(
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
