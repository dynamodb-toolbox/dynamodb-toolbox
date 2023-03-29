import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import type { Item } from 'v1/item'
import type { Condition } from 'v1/commands/condition/types'

import { ConditionParser } from './conditionParser'

export const parseCondition = <ITEM extends Item, CONDITION extends Condition<ITEM>>(
  item: ITEM,
  condition: CONDITION
): Pick<
  PutCommandInput,
  'ExpressionAttributeNames' | 'ExpressionAttributeValues' | 'ConditionExpression'
> => {
  const conditionParser = new ConditionParser(item)
  conditionParser.parseCondition(condition)
  return conditionParser.toCommandOptions()
}
