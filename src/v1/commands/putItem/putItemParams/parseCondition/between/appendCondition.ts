import type { ParsingState } from '../types'
import { appendAttributePath } from '../utils/appendAttributePath'
import { appendAttributeValueOrPath } from '../utils/appendAttributeValueOrPath'

import type { BetweenCondition } from './types'

export const appendBetweenCondition = (
  prevParsingState: ParsingState,
  condition: BetweenCondition
): ParsingState => {
  let nextParsingState: ParsingState = {
    expressionAttributeNames: [...prevParsingState.expressionAttributeNames],
    expressionAttributeValues: [...prevParsingState.expressionAttributeValues],
    conditionExpression: ''
  }

  const attributePath = condition.size ?? condition.path
  const expressionAttributeValue = condition.between

  const [lowerRange, higherRange] = expressionAttributeValue

  nextParsingState = appendAttributePath(nextParsingState, attributePath, {
    size: !!condition.size
  })

  nextParsingState.conditionExpression += ' BETWEEN '

  nextParsingState = appendAttributeValueOrPath(nextParsingState, lowerRange)

  nextParsingState.conditionExpression += ' AND '

  nextParsingState = appendAttributeValueOrPath(nextParsingState, higherRange)

  return nextParsingState
}
