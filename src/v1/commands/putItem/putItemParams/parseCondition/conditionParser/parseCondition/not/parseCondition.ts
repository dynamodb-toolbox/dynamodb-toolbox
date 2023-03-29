import type { ConditionParser } from '../../conditionParser'

import type { NotCondition } from './types'

export const parseNotCondition = (
  conditionParser: ConditionParser,
  condition: NotCondition
): void => {
  conditionParser.resetConditionExpression()

  const { not: negatedCondition } = condition
  conditionParser.parseCondition(negatedCondition)

  conditionParser.conditionExpression = `NOT (${conditionParser.conditionExpression})`
}
