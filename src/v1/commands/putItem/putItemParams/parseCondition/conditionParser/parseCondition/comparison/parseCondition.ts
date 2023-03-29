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
  conditionParser.resetConditionExpression()

  const comparisonOperator = Object.keys(condition).find(isComparisonOperator) as keyof CONDITION &
    ComparisonOperator

  const attributePath = condition.size ?? condition.path
  const expressionAttributeValue = condition[comparisonOperator]

  const attribute = conditionParser.appendAttributePath(attributePath, { size: !!condition.size })

  conditionParser.conditionExpression += ` ${comparisonOperatorExpression[comparisonOperator]} `

  conditionParser.appendAttributeValueOrPath(attribute, expressionAttributeValue)
}
