import { has } from '~/utils/has.js'

import type { ConditionParser } from '../../conditionParser.js'
import type { InCondition } from './types.js'

export const parseInCondition = (
  conditionParser: ConditionParser,
  condition: InCondition
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

  const expressionAttributeValues = condition.in

  conditionParser.resetExpression()
  const attribute = conditionParser.appendAttributePath(attributePath, { size })
  conditionParser.appendToExpression(' IN (')
  expressionAttributeValues.forEach((expressionAttributeValue, index) => {
    if (index > 0) {
      conditionParser.appendToExpression(', ')
    }
    conditionParser.appendAttributeValueOrPath(attribute, expressionAttributeValue, { transform })
  })
  conditionParser.appendToExpression(')')
}
