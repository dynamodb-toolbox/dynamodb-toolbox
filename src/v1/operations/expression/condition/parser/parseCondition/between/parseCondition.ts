import type { ConditionParser } from '../../parser'

import type { BetweenCondition } from './types'

export const parseBetweenCondition = (
  conditionParser: ConditionParser,
  condition: BetweenCondition
): void => {
  const attributePath = condition.size ?? condition.attr
  const [lowerRange, higherRange] = condition.between

  conditionParser.resetExpression()
  const attribute = conditionParser.appendAttributePath(attributePath, { size: !!condition.size })
  conditionParser.appendToExpression(' BETWEEN ')
  conditionParser.appendAttributeValueOrPath(attribute, lowerRange)
  conditionParser.appendToExpression(' AND ')
  conditionParser.appendAttributeValueOrPath(attribute, higherRange)
}
