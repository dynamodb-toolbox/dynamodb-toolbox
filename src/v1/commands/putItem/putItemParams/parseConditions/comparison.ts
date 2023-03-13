import type { Condition, Conditions } from 'v1/commands/conditions/types'

import type { ParsingState } from './types'

type ComparisonOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'

const comparisonOperatorSet = new Set<ComparisonOperator>(['eq', 'ne', 'gt', 'gte', 'lt', 'lte'])

const isComparisonOperator = (key: string): key is ComparisonOperator =>
  comparisonOperatorSet.has(key as ComparisonOperator)

export const detectConditionType = (
  condition: Conditions
): { type: 'comparison'; condition: Condition; operator: ComparisonOperator } | undefined => {
  for (const conditionKey of Object.keys(condition)) {
    if (isComparisonOperator(conditionKey)) {
      return { type: 'comparison', condition: condition as Condition, operator: conditionKey }
    }
  }
}

const comparisonOperatorExpression = {
  eq: '=',
  ne: '<>',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<='
}

export const parseComparisonCondition = <COMPARISON_OPERATOR extends ComparisonOperator>(
  condition: Condition,
  comparisonOperator: COMPARISON_OPERATOR,
  { expressionAttributeNames, expressionAttributeValues }: ParsingState
): ParsingState => {
  const { path: attributePath, [comparisonOperator]: expressionAttributeValue } = condition

  const pathMatches = attributePath.matchAll(/\w+(?=(\.|$|((\[\d+\])+)))/g)

  let conditionExpression = ''

  for (const pathMatch of pathMatches) {
    const [expressionAttributeName, followingSeparator] = pathMatch

    const expressionAttributeNameIndex = expressionAttributeNames.push(expressionAttributeName)
    conditionExpression += `#${expressionAttributeNameIndex}${followingSeparator}`
  }

  const expressionAttributeValueIndex = expressionAttributeValues.push(expressionAttributeValue)
  conditionExpression += ` ${comparisonOperatorExpression[comparisonOperator]} :${expressionAttributeValueIndex}`

  return { expressionAttributeNames, expressionAttributeValues, conditionExpression }
}
