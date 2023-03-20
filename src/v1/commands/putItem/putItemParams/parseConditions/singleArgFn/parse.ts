import type { Condition } from 'v1/commands/conditions/types'

import type { ParsingState } from '../types'
import type { SingleArgFnOperator } from './operators'
import { parseAttributePath } from '../utils/parseAttributePath'

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
  parsingState: ParsingState
): ParsingState => {
  const { path: attributePath, [comparisonOperator]: expressionAttributeValue } = condition

  parsingState.conditionExpression = `${getSingleArgFnOperatorExpression(
    comparisonOperator,
    expressionAttributeValue
  )}(`

  parseAttributePath(attributePath, parsingState)

  parsingState.conditionExpression += ')'

  return parsingState
}
