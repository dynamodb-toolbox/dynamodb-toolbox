import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import type { Item } from 'v1/item'
import type { Condition } from 'v1/commands/condition/types'

import { appendCondition } from './appendCondition'
import { ConditionParsingState } from './parsingState'

export const parseCondition = <ITEM extends Item, CONDITION extends Condition<ITEM>>(
  item: ITEM,
  condition: CONDITION
): Pick<
  PutCommandInput,
  'ExpressionAttributeNames' | 'ExpressionAttributeValues' | 'ConditionExpression'
> => {
  const state = new ConditionParsingState(item)

  appendCondition(state, condition)

  const ExpressionAttributeNames: PutCommandInput['ExpressionAttributeNames'] = {}
  state.expressionAttributeNames.forEach((expressionAttributeName, index) => {
    ExpressionAttributeNames[`#${index + 1}`] = expressionAttributeName
  })

  const ExpressionAttributeValues: PutCommandInput['ExpressionAttributeValues'] = {}
  state.expressionAttributeValues.forEach((expressionAttributeValue, index) => {
    ExpressionAttributeValues[`:${index + 1}`] = expressionAttributeValue
  })

  const ConditionExpression = state.conditionExpression

  return {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression
  }
}
