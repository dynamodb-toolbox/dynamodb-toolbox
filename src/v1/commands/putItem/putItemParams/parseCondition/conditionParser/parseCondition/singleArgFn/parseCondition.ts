import type { ConditionParser } from '../../conditionParser'

import type { SingleArgFnCondition } from './types'

export const parseSingleArgFnCondition = (
  conditionParser: ConditionParser,
  condition: SingleArgFnCondition
): void => {
  conditionParser.resetConditionExpression()

  // TOIMPROVE: It doesn't make sense to use size in single arg fns
  const attributePath = condition.size ?? condition.path
  const expressionAttributeValue = condition.exists

  conditionParser.conditionExpression = `${
    expressionAttributeValue === true ? 'attribute_exists' : 'attribute_not_exists'
  }(`

  conditionParser.appendAttributePath(attributePath, { size: !!condition.size })

  conditionParser.conditionExpression += ')'
}
