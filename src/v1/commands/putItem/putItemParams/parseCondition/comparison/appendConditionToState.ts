import type { ParsingState } from '../types'
import { appendAttributePathToState } from '../utils/appendAttributePathToState'
import { appendAttributeValueOrPathToState } from '../utils/appendAttributeValueOrPathToState'

import { isComparisonOperator, ComparisonCondition, ComparisonOperator } from './types'

const comparisonOperatorExpression: Record<ComparisonOperator, string> = {
  eq: '=',
  ne: '<>',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<='
}

export const appendComparisonConditionToState = <CONDITION extends ComparisonCondition>(
  prevParsingState: ParsingState,
  condition: CONDITION
): ParsingState => {
  let nextParsingState: ParsingState = {
    expressionAttributeNames: [...prevParsingState.expressionAttributeNames],
    expressionAttributeValues: [...prevParsingState.expressionAttributeValues],
    conditionExpression: ''
  }

  const comparisonOperator = Object.keys(condition).find(isComparisonOperator) as keyof CONDITION &
    ComparisonOperator

  const { path: attributePath, [comparisonOperator]: expressionAttributeValue } = condition

  nextParsingState = appendAttributePathToState(nextParsingState, attributePath)

  nextParsingState.conditionExpression += ` ${comparisonOperatorExpression[comparisonOperator]} `

  nextParsingState = appendAttributeValueOrPathToState(nextParsingState, expressionAttributeValue)

  return nextParsingState
}
