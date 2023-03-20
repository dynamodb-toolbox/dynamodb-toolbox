import type { Condition } from 'v1/commands/conditions/types'

import type { ParsingState } from '../types'
import { isAttributePath } from '../utils/isAttributePath'
import { parseAttributePath } from '../utils/parseAttributePath'
import type { ComparisonOperator } from './operators'

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
  parsingState: ParsingState
): ParsingState => {
  const { path: attributePath, [comparisonOperator]: expressionAttributeValue } = condition

  parsingState.conditionExpression = ''

  parseAttributePath(attributePath, parsingState)

  parsingState.conditionExpression += ` ${comparisonOperatorExpression[comparisonOperator]} `

  if (isAttributePath(expressionAttributeValue)) {
    parseAttributePath(expressionAttributeValue.attr, parsingState)
  } else {
    const expressionAttributeValueIndex = parsingState.expressionAttributeValues.push(
      expressionAttributeValue
    )
    parsingState.conditionExpression += `:${expressionAttributeValueIndex}`
  }

  return parsingState
}
