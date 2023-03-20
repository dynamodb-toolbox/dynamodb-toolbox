import type { ParsingState } from '../types'
import { appendAttributePathToState } from '../utils/appendAttributePathToState'

import type { SingleArgFnCondition } from './types'

export const appendSingleArgFnConditionToState = (
  prevParsingState: ParsingState,
  condition: SingleArgFnCondition
): ParsingState => {
  const { path: attributePath, exists: expressionAttributeValue } = condition

  let nextParsingState: ParsingState = {
    expressionAttributeNames: [...prevParsingState.expressionAttributeNames],
    expressionAttributeValues: [...prevParsingState.expressionAttributeValues],
    conditionExpression: `${
      expressionAttributeValue === true ? 'attribute_exists' : 'attribute_not_exists'
    }(`
  }

  nextParsingState = appendAttributePathToState(nextParsingState, attributePath)

  nextParsingState.conditionExpression += ')'

  return nextParsingState
}
