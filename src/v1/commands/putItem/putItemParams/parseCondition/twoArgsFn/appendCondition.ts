import type { ConditionParsingState } from '../parsingState'

import { TwoArgsFnOperator, isTwoArgsFnOperator, TwoArgsFnCondition } from './types'

const twoArgsFnOperatorExpression: Record<TwoArgsFnOperator, string> = {
  contains: 'contains',
  beginsWith: 'begins_with',
  type: 'attribute_type'
}

export const appendTwoArgsFnCondition = <CONDITION extends TwoArgsFnCondition>(
  state: ConditionParsingState,
  condition: CONDITION
): void => {
  state.resetConditionExpression()

  const comparisonOperator = Object.keys(condition).find(isTwoArgsFnOperator) as keyof CONDITION &
    TwoArgsFnOperator

  // TOIMPROVE: It doesn't make sense to use size in two args fns
  const attributePath = condition.size ?? condition.path
  const expressionAttributeValue = condition[comparisonOperator]

  state.conditionExpression = `${twoArgsFnOperatorExpression[comparisonOperator]}(`

  const attribute = state.appendAttributePath(attributePath, { size: !!condition.size })

  state.conditionExpression += `, `

  state.appendAttributeValueOrPath(attribute, expressionAttributeValue)

  state.conditionExpression += `)`
}
