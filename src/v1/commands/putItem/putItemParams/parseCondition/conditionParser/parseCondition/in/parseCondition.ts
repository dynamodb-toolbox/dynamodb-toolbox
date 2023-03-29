import type { ConditionParser } from '../../conditionParser'

import type { InCondition } from './types'

export const parseInCondition = (
  conditionParser: ConditionParser,
  condition: InCondition
): void => {
  const attributePath = condition.size ?? condition.path
  const expressionAttributeValues = condition.in

  conditionParser.resetConditionExpression()
  const attribute = conditionParser.appendAttributePath(attributePath, { size: !!condition.size })
  conditionParser.appendToConditionExpression(' IN (')
  expressionAttributeValues.forEach((expressionAttributeValue, index) => {
    if (index > 0) {
      conditionParser.appendToConditionExpression(', ')
    }
    conditionParser.appendAttributeValueOrPath(attribute, expressionAttributeValue)
  })
  conditionParser.appendToConditionExpression(')')
}
