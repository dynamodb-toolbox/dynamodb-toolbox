import type { ConditionParser } from '../../conditionParser.js'
import type { SingleArgFnCondition } from './types.js'

export const parseSingleArgFnCondition = (
  conditionParser: ConditionParser,
  condition: SingleArgFnCondition
): void => {
  // TOIMPROVE: It doesn't make sense to use size in single arg fns
  const attributePath = condition.size ?? condition.attr

  conditionParser.resetExpression(
    `${condition.exists === true ? 'attribute_exists' : 'attribute_not_exists'}(`
  )
  conditionParser.appendAttributePath(attributePath, { size: !!condition.size })
  conditionParser.appendToExpression(')')
}
