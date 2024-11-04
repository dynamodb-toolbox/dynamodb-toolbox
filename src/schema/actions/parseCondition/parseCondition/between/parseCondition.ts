import { has } from '~/utils/has.js'

import type { ConditionParser } from '../../conditionParser.js'
import type { BetweenCondition } from './types.js'

export const parseBetweenCondition = (
  conditionParser: ConditionParser,
  condition: BetweenCondition
): void => {
  let attributePath: string
  let transform: boolean

  const size = has(condition, 'size')
  if (size) {
    attributePath = condition.size
    transform = false
  } else {
    attributePath = condition.attr
    transform = condition.transform ?? true
  }

  const [lowerRange, higherRange] = condition.between

  conditionParser.resetExpression()
  const attribute = conditionParser.appendAttributePath(attributePath, { size })
  conditionParser.appendToExpression(' BETWEEN ')
  conditionParser.appendAttributeValueOrPath(attribute, lowerRange, { transform })
  conditionParser.appendToExpression(' AND ')
  conditionParser.appendAttributeValueOrPath(attribute, higherRange, { transform })
}
