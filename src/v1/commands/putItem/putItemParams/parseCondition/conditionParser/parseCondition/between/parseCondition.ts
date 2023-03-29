import type { ConditionParser } from '../../conditionParser'

import type { BetweenCondition } from './types'

export const parseBetweenCondition = (
  conditionParser: ConditionParser,
  condition: BetweenCondition
): void => {
  const attributePath = condition.size ?? condition.path
  const [lowerRange, higherRange] = condition.between

  conditionParser.resetConditionExpression()
  const attribute = conditionParser.appendAttributePath(attributePath, { size: !!condition.size })
  conditionParser.appendToConditionExpression(' BETWEEN ')
  conditionParser.appendAttributeValueOrPath(attribute, lowerRange)
  conditionParser.appendToConditionExpression(' AND ')
  conditionParser.appendAttributeValueOrPath(attribute, higherRange)
}
