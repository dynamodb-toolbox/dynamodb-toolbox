import type { Condition } from 'v1/commands/conditions/types'

import type { ParsingState } from '../types'
import type { SingleArgFnOperator } from './operators'

const getSingleArgFnOperatorExpression = (
  comparisonOperator: SingleArgFnOperator,
  expressionAttributeValue: unknown
) => {
  switch (comparisonOperator) {
    case 'exists': {
      switch (expressionAttributeValue) {
        case true:
          return 'attribute_exists'
        case false:
          return 'attribute_not_exists'
      }
    }
  }

  // TODO
  throw new Error()
}

export const parseSingleArgFnCondition = <SINGLE_ARG_FN_OPERATOR extends SingleArgFnOperator>(
  condition: Condition,
  comparisonOperator: SINGLE_ARG_FN_OPERATOR,
  { expressionAttributeNames, expressionAttributeValues }: ParsingState
): ParsingState => {
  const { path: attributePath, [comparisonOperator]: expressionAttributeValue } = condition

  let conditionExpression = `${getSingleArgFnOperatorExpression(
    comparisonOperator,
    expressionAttributeValue
  )}(`

  const pathMatches = attributePath.matchAll(/\w+(?=(\.|$|((\[\d+\])+)))/g)
  for (const pathMatch of pathMatches) {
    const [expressionAttributeName, followingSeparator] = pathMatch

    const expressionAttributeNameIndex = expressionAttributeNames.push(expressionAttributeName)
    conditionExpression += `#${expressionAttributeNameIndex}${followingSeparator}`
  }

  conditionExpression += ')'

  return { expressionAttributeNames, expressionAttributeValues, conditionExpression }
}
