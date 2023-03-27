import type { ParsingState } from '../types'
import { appendAttributePath } from '../utils/appendAttributePath'

import { TwoArgsFnOperator, isTwoArgsFnOperator, TwoArgsFnCondition } from './types'
import { appendAttributeValueOrPath } from '../utils/appendAttributeValueOrPath'

const twoArgsFnOperatorExpression: Record<TwoArgsFnOperator, string> = {
  contains: 'contains',
  beginsWith: 'begins_with',
  type: 'attribute_type'
}

export const appendTwoArgsFnCondition = <CONDITION extends TwoArgsFnCondition>(
  prevParsingState: ParsingState,
  condition: CONDITION
): ParsingState => {
  let nextParsingState: ParsingState = {
    expressionAttributeNames: [...prevParsingState.expressionAttributeNames],
    expressionAttributeValues: [...prevParsingState.expressionAttributeValues],
    conditionExpression: ''
  }

  const comparisonOperator = Object.keys(condition).find(isTwoArgsFnOperator) as keyof CONDITION &
    TwoArgsFnOperator

  // TOIMPROVE: It doesn't make sense to use size in two args fns
  const attributePath = condition.size ?? condition.path
  const expressionAttributeValue = condition[comparisonOperator]

  nextParsingState.conditionExpression = `${twoArgsFnOperatorExpression[comparisonOperator]}(`

  nextParsingState = appendAttributePath(nextParsingState, attributePath, {
    size: !!condition.size
  })

  nextParsingState.conditionExpression += `, `

  nextParsingState = appendAttributeValueOrPath(nextParsingState, expressionAttributeValue)

  nextParsingState.conditionExpression += `)`

  return nextParsingState
}
