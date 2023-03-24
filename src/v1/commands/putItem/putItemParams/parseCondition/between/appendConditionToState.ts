import type { ParsingState } from '../types'
import { appendAttributePathToState } from '../utils/appendAttributePathToState'
import { appendAttributeValueOrPathToState } from '../utils/appendAttributeValueOrPathToState'

import type { BetweenCondition } from './types'

export const appendBetweenConditionToState = (
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

  nextParsingState = appendAttributePathToState(nextParsingState, attributePath, {
    size: !!condition.size
  })

  nextParsingState.conditionExpression += ' BETWEEN '

  nextParsingState = appendAttributeValueOrPathToState(nextParsingState, lowerRange)

  nextParsingState.conditionExpression += ' AND '

  nextParsingState = appendAttributeValueOrPathToState(nextParsingState, higherRange)

  return nextParsingState
}
