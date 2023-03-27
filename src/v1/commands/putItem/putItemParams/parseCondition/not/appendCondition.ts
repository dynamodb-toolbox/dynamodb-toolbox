import type { ParsingState } from '../types'
import { appendCondition } from '../appendCondition'

import type { NotCondition } from './types'

export const appendNotCondition = (
  prevParsingState: ParsingState,
  condition: NotCondition
): ParsingState => {
  const { not: negatedCondition } = condition

  const negatedConditionState = appendCondition(prevParsingState, negatedCondition)

  return {
    ...negatedConditionState,
    conditionExpression: `NOT (${negatedConditionState.conditionExpression})`
  }
}
