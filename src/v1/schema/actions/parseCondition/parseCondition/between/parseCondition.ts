import type { ConditionParser } from '../../conditionParser'

import type { BetweenCondition } from './types'

export const parseBetweenCondition = (
  conditionParser: ConditionParser,
  condition: BetweenCondition
): void => {
  const attributePath = condition.size ?? condition.attr
  const [lowerRange, higherRange] = condition.between
  const { transform = true } = condition

  conditionParser.resetExpression()
  const attribute = conditionParser.appendAttributePath(attributePath, { size: !!condition.size })
  conditionParser.appendToExpression(' BETWEEN ')
  conditionParser.appendAttributeValueOrPath(attribute, lowerRange, { transform })
  conditionParser.appendToExpression(' AND ')
  conditionParser.appendAttributeValueOrPath(attribute, higherRange, { transform })
}
