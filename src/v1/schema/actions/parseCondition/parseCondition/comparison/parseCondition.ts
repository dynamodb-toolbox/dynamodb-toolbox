import type { ConditionParser } from '../../conditionParser'

import { isComparisonOperator, ComparisonCondition, ComparisonOperator } from './types'

const comparisonOperatorExpression: Record<ComparisonOperator, string> = {
  eq: '=',
  ne: '<>',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<='
}

export const parseComparisonCondition = <CONDITION extends ComparisonCondition>(
  conditionParser: ConditionParser,
  condition: CONDITION
): void => {
  const comparisonOperator = Object.keys(condition).find(isComparisonOperator) as keyof CONDITION &
    ComparisonOperator

  const attributePath = condition.size ?? condition.attr
  const expressionAttributeValue = condition[comparisonOperator]
  const { transform = true } = condition

  conditionParser.resetExpression()
  const attribute = conditionParser.appendAttributePath(attributePath, { size: !!condition.size })
  conditionParser.appendToExpression(` ${comparisonOperatorExpression[comparisonOperator]} `)
  conditionParser.appendAttributeValueOrPath(attribute, expressionAttributeValue, { transform })
}
