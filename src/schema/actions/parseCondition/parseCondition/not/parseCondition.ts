import type { ConditionParser } from '../../conditionParser.js'
import type { NotCondition } from './types.js'

export const parseNotCondition = (
  conditionParser: ConditionParser,
  condition: NotCondition
): void => {
  const { not: negatedCondition } = condition

  conditionParser.resetExpression()
  conditionParser.parse(negatedCondition)
  conditionParser.resetExpression('NOT (', ...conditionParser.expression, ')')
}
