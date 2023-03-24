import type { ParsingState } from '../types'
import { appendAttributePathToState } from '../utils/appendAttributePathToState'
import { appendAttributeValueOrPathToState } from '../utils/appendAttributeValueOrPathToState'

import type { InCondition } from './types'

export const appendInConditionToState = (
  prevParsingState: ParsingState,
  condition: InCondition
): ParsingState => {
  let nextParsingState: ParsingState = {
    expressionAttributeNames: [...prevParsingState.expressionAttributeNames],
    expressionAttributeValues: [...prevParsingState.expressionAttributeValues],
    conditionExpression: ''
  }

  const attributePath = condition.size ?? condition.path
  const expressionAttributeValues = condition.in

  nextParsingState = appendAttributePathToState(nextParsingState, attributePath, {
    size: !!condition.size
  })

  nextParsingState.conditionExpression += ' IN ('

  expressionAttributeValues.forEach((expressionAttributeValue, index) => {
    if (index > 0) {
      nextParsingState.conditionExpression += ', '
    }

    nextParsingState = appendAttributeValueOrPathToState(nextParsingState, expressionAttributeValue)
  })

  nextParsingState.conditionExpression += ')'

  return nextParsingState
}
