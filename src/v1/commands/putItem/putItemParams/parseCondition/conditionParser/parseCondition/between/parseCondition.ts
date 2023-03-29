import type { ConditionParser } from '../../conditionParser'

import type { BetweenCondition } from './types'

export const parseBetweenCondition = (
  conditionParser: ConditionParser,
  condition: BetweenCondition
): void => {
  conditionParser.resetConditionExpression()

  const attributePath = condition.size ?? condition.path
  const expressionAttributeValue = condition.between

  const [lowerRange, higherRange] = expressionAttributeValue

  const attribute = conditionParser.appendAttributePath(attributePath, { size: !!condition.size })

  conditionParser.conditionExpression += ' BETWEEN '

  conditionParser.appendAttributeValueOrPath(attribute, lowerRange)

  conditionParser.conditionExpression += ' AND '

  conditionParser.appendAttributeValueOrPath(attribute, higherRange)
}
