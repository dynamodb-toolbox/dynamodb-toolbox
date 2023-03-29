import type { ConditionParser } from '../../conditionParser'

import type { NotCondition } from './types'

export const parseNotCondition = (
  conditionParser: ConditionParser,
  condition: NotCondition
): void => {
  const { not: negatedCondition } = condition

  conditionParser.resetConditionExpression()
  conditionParser.parseCondition(negatedCondition)
  conditionParser.resetConditionExpression(`NOT (${conditionParser.conditionExpression})`)
}
