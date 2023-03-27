import type { Condition } from 'v1/commands/condition/types'
import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import { appendCondition } from './appendCondition'
import { ParsingState } from './types'

export const parseCondition = (
  condition: Condition
): Pick<
  PutCommandInput,
  'ExpressionAttributeNames' | 'ExpressionAttributeValues' | 'ConditionExpression'
> => {
  const initialState: ParsingState = {
    expressionAttributeNames: [],
    expressionAttributeValues: [],
    conditionExpression: ''
  }

  const {
    expressionAttributeNames,
    expressionAttributeValues,
    conditionExpression: ConditionExpression
  } = appendCondition(initialState, condition)

  const ExpressionAttributeNames: PutCommandInput['ExpressionAttributeNames'] = {}
  expressionAttributeNames.forEach((expressionAttributeName, index) => {
    ExpressionAttributeNames[`#${index + 1}`] = expressionAttributeName
  })

  const ExpressionAttributeValues: PutCommandInput['ExpressionAttributeValues'] = {}
  expressionAttributeValues.forEach((expressionAttributeValue, index) => {
    ExpressionAttributeValues[`:${index + 1}`] = expressionAttributeValue
  })

  return {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression
  }
}
