import type { ConditionParsingState } from '../parsingState'

import type { SingleArgFnCondition } from './types'

export const appendSingleArgFnCondition = (
  state: ConditionParsingState,
  condition: SingleArgFnCondition
): void => {
  state.resetConditionExpression()

  // TOIMPROVE: It doesn't make sense to use size in single arg fns
  const attributePath = condition.size ?? condition.path
  const expressionAttributeValue = condition.exists

  state.conditionExpression = `${
    expressionAttributeValue === true ? 'attribute_exists' : 'attribute_not_exists'
  }(`

  state.appendAttributePath(attributePath, { size: !!condition.size })

  state.conditionExpression += ')'
}
