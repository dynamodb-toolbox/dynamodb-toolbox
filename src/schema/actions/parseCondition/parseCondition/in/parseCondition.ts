import type { ConditionParser } from '../../conditionParser.js'

import type { InCondition } from './types.js'

export const parseInCondition = (
  conditionParser: ConditionParser,
  condition: InCondition
): void => {
  const attributePath = condition.size ?? condition.attr
  const { transform = true, in: expressionAttributeValues } = condition

  conditionParser.resetExpression()
  const attribute = conditionParser.appendAttributePath(attributePath, { size: !!condition.size })
  conditionParser.appendToExpression(' IN (')
  expressionAttributeValues.forEach((expressionAttributeValue, index) => {
    if (index > 0) {
      conditionParser.appendToExpression(', ')
    }
    conditionParser.appendAttributeValueOrPath(attribute, expressionAttributeValue, { transform })
  })
  conditionParser.appendToExpression(')')
}
