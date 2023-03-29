import type { ConditionParser } from '../../conditionParser'

import type { InCondition } from './types'

export const parseInCondition = (
  conditionParser: ConditionParser,
  condition: InCondition
): void => {
  conditionParser.resetConditionExpression()

  const attributePath = condition.size ?? condition.path
  const expressionAttributeValues = condition.in

  const attribute = conditionParser.appendAttributePath(attributePath, { size: !!condition.size })

  conditionParser.conditionExpression += ' IN ('

  expressionAttributeValues.forEach((expressionAttributeValue, index) => {
    if (index > 0) {
      conditionParser.conditionExpression += ', '
    }

    conditionParser.appendAttributeValueOrPath(attribute, expressionAttributeValue)
  })

  conditionParser.conditionExpression += ')'
}
