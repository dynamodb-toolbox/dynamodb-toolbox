import type { ConditionParser } from '../../conditionParser.js'
import type { SingleArgFnCondition } from './types.js'

export const parseSingleArgFnCondition = (
  conditionParser: ConditionParser,
  condition: SingleArgFnCondition
): void => {
  const attributePath = condition.attr

  conditionParser.resetExpression(
    `${condition.exists === true ? 'attribute_exists' : 'attribute_not_exists'}(`
  )
  conditionParser.appendAttributePath(attributePath)
  conditionParser.appendToExpression(')')
}
