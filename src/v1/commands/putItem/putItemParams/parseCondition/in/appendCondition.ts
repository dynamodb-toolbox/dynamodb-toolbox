import type { ParsingState } from '../types'
import { appendAttributePath } from '../utils/appendAttributePath'
import { appendAttributeValueOrPath } from '../utils/appendAttributeValueOrPath'

import type { InCondition } from './types'

export const appendInCondition = (
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

  nextParsingState = appendAttributePath(nextParsingState, attributePath, {
    size: !!condition.size
  })

  nextParsingState.conditionExpression += ' IN ('

  expressionAttributeValues.forEach((expressionAttributeValue, index) => {
    if (index > 0) {
      nextParsingState.conditionExpression += ', '
    }

    nextParsingState = appendAttributeValueOrPath(nextParsingState, expressionAttributeValue)
  })

  nextParsingState.conditionExpression += ')'

  return nextParsingState
}
