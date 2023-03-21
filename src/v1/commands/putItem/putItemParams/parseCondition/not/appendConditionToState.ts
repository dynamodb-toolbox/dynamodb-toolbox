import type { ParsingState } from '../types'
import { appendConditionToState } from '../appendConditionToState'

import type { NotCondition } from './types'

export const appendNotConditionToState = (
  prevParsingState: ParsingState,
  condition: NotCondition
): ParsingState => {
  const { not: negatedCondition } = condition

  const negatedConditionState = appendConditionToState(prevParsingState, negatedCondition)

  return {
    ...negatedConditionState,
    conditionExpression: `NOT (${negatedConditionState.conditionExpression})`
  }
}
