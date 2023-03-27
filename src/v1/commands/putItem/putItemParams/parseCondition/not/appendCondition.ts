import type { ConditionParsingState } from '../parsingState'
import { appendCondition } from '../appendCondition'

import type { NotCondition } from './types'

export const appendNotCondition = (state: ConditionParsingState, condition: NotCondition): void => {
  state.resetConditionExpression()

  const { not: negatedCondition } = condition
  appendCondition(state, negatedCondition)

  state.conditionExpression = `NOT (${state.conditionExpression})`
}
