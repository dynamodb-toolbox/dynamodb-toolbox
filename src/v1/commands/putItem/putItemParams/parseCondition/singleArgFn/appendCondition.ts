import type { ParsingState } from '../types'
import { appendAttributePath } from '../utils/appendAttributePath'

import type { SingleArgFnCondition } from './types'

export const appendSingleArgFnCondition = (
  prevParsingState: ParsingState,
  condition: SingleArgFnCondition
): ParsingState => {
  // TOIMPROVE: It doesn't make sense to use size in single arg fns
  const attributePath = condition.size ?? condition.path
  const expressionAttributeValue = condition.exists

  let nextParsingState: ParsingState = {
    expressionAttributeNames: [...prevParsingState.expressionAttributeNames],
    expressionAttributeValues: [...prevParsingState.expressionAttributeValues],
    conditionExpression: `${
      expressionAttributeValue === true ? 'attribute_exists' : 'attribute_not_exists'
    }(`
  }

  nextParsingState = appendAttributePath(nextParsingState, attributePath, {
    size: !!condition.size
  })

  nextParsingState.conditionExpression += ')'

  return nextParsingState
}
