import { has } from '~/utils/has.js'

import type { ConditionParser } from '../../conditionParser.js'
import { isComparisonOperator } from './types.js'
import type { ComparisonCondition, ComparisonOperator } from './types.js'

const comparisonOperatorExpression: Record<ComparisonOperator, string> = {
  eq: '=',
  ne: '<>',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<='
}

export const parseComparisonCondition = (
  conditionParser: ConditionParser,
  condition: ComparisonCondition
) => {
  let attributePath: string
  let transform: boolean

  const size = has(condition, 'size')
  if (size) {
    attributePath = condition.size
    transform = false
  } else {
    attributePath = condition.attr
    transform = condition.transform ?? true
  }

  const comparisonOperator = Object.keys(condition).find(
    isComparisonOperator
  ) as keyof ComparisonCondition
  const expressionAttributeValue = condition[comparisonOperator]

  conditionParser.resetExpression()
  const attribute = conditionParser.appendAttributePath(attributePath, { size })
  conditionParser.appendToExpression(` ${comparisonOperatorExpression[comparisonOperator]} `)
  conditionParser.appendAttributeValueOrPath(attribute, expressionAttributeValue, { transform })
}
