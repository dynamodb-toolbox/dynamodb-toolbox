import type { ParsingState } from '../types'
import { appendAttributePath } from '../utils/appendAttributePath'
import { appendAttributeValueOrPath } from '../utils/appendAttributeValueOrPath'

import { isComparisonOperator, ComparisonCondition, ComparisonOperator } from './types'

const comparisonOperatorExpression: Record<ComparisonOperator, string> = {
  eq: '=',
  ne: '<>',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<='
}

export const appendComparisonCondition = <CONDITION extends ComparisonCondition>(
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

  const attributePath = condition.size ?? condition.path
  const expressionAttributeValue = condition[comparisonOperator]

  nextParsingState = appendAttributePath(nextParsingState, attributePath, {
    size: !!condition.size
  })

  nextParsingState.conditionExpression += ` ${comparisonOperatorExpression[comparisonOperator]} `

  nextParsingState = appendAttributeValueOrPath(nextParsingState, expressionAttributeValue)

  return nextParsingState
}
