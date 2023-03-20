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

  const { path: attributePath, between: expressionAttributeValue } = condition

  const [lowerRange, higherRange] = expressionAttributeValue

  nextParsingState = appendAttributePathToState(nextParsingState, attributePath)

  nextParsingState.conditionExpression += ` BETWEEN `

  nextParsingState = appendAttributeValueOrPathToState(nextParsingState, lowerRange)

  nextParsingState.conditionExpression += ` AND `

  nextParsingState = appendAttributeValueOrPathToState(nextParsingState, higherRange)

  return nextParsingState
}
