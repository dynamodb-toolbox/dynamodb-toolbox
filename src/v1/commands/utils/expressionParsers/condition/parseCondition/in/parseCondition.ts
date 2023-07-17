import type { ConditionParser } from '../../conditionParser'

import type { InCondition } from './types'

export const parseInCondition = (
  conditionParser: ConditionParser,
  condition: InCondition
): void => {
  const attributePath = condition.size ?? condition.attr
  const expressionAttributeValues = condition.in

  conditionParser.resetExpression()
  const attribute = conditionParser.appendAttributePath(attributePath, { size: !!condition.size })
  conditionParser.appendToExpression(' IN (')
  expressionAttributeValues.forEach((expressionAttributeValue, index) => {
    if (index > 0) {
      conditionParser.appendToExpression(', ')
    }
    conditionParser.appendAttributeValueOrPath(attribute, expressionAttributeValue)
  })
  conditionParser.appendToExpression(')')
}
