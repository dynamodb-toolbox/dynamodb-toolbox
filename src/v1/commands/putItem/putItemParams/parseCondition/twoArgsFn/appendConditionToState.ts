import type { ParsingState } from '../types'
import { appendAttributePathToState } from '../utils/appendAttributePathToState'

import { TwoArgsFnOperator, isTwoArgsFnOperator, TwoArgsFnCondition } from './types'
import { appendAttributeValueOrPathToState } from '../utils/appendAttributeValueOrPathToState'

const twoArgsFnOperatorExpression: Record<TwoArgsFnOperator, string> = {
  contains: 'contains',
  beginsWith: 'begins_with',
  type: 'attribute_type'
}

export const appendTwoArgsFnConditionToState = <CONDITION extends TwoArgsFnCondition>(
  prevParsingState: ParsingState,
  condition: CONDITION
): ParsingState => {
  let nextParsingState: ParsingState = {
    expressionAttributeNames: [...prevParsingState.expressionAttributeNames],
    expressionAttributeValues: [...prevParsingState.expressionAttributeValues],
    conditionExpression: ''
  }

  const comparisonOperator = Object.keys(condition).find(isTwoArgsFnOperator) as keyof CONDITION &
    TwoArgsFnOperator

  const { path: attributePath, [comparisonOperator]: expressionAttributeValue } = condition

  nextParsingState.conditionExpression = `${twoArgsFnOperatorExpression[comparisonOperator]}(`

  nextParsingState = appendAttributePathToState(nextParsingState, attributePath)

  nextParsingState.conditionExpression += `, `

  nextParsingState = appendAttributeValueOrPathToState(nextParsingState, expressionAttributeValue)

  nextParsingState.conditionExpression += `)`

  return nextParsingState
}
