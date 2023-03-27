import type { ConditionParsingState } from '../parsingState'

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
  state: ConditionParsingState,
  condition: CONDITION
): void => {
  state.resetConditionExpression()

  const comparisonOperator = Object.keys(condition).find(isComparisonOperator) as keyof CONDITION &
    ComparisonOperator

  const attributePath = condition.size ?? condition.path
  const expressionAttributeValue = condition[comparisonOperator]

  const attribute = state.appendAttributePath(attributePath, { size: !!condition.size })

  state.conditionExpression += ` ${comparisonOperatorExpression[comparisonOperator]} `

  state.appendAttributeValueOrPath(attribute, expressionAttributeValue)
}
