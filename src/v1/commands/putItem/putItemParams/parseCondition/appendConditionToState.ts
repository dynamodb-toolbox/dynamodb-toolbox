import type { Condition } from 'v1/commands/condition/types'

import type { ParsingState } from './types'
import { isComparisonCondition, appendComparisonConditionToState } from './comparison'
import { isSingleArgFnCondition, appendSingleArgFnConditionToState } from './singleArgFn'
import { isBetweenCondition, appendBetweenConditionToState } from './between'
import { isNotCondition, appendNotConditionToState } from './not'
import {
  isLogicalCombinationCondition,
  appendLogicalCombinationConditionToState
} from './logicalCombination'
import { isTwoArgsFnCondition, appendTwoArgsFnConditionToState } from './twoArgsFn'
import { isInCondition, appendInConditionToState } from './in'

export const appendConditionToState = (state: ParsingState, condition: Condition): ParsingState => {
  if (isComparisonCondition(condition)) {
    return appendComparisonConditionToState(state, condition)
  }

  if (isSingleArgFnCondition(condition)) {
    return appendSingleArgFnConditionToState(state, condition)
  }

  if (isBetweenCondition(condition)) {
    return appendBetweenConditionToState(state, condition)
  }

  if (isNotCondition(condition)) {
    return appendNotConditionToState(state, condition)
  }

  if (isLogicalCombinationCondition(condition)) {
    return appendLogicalCombinationConditionToState(state, condition)
  }

  if (isTwoArgsFnCondition(condition)) {
    return appendTwoArgsFnConditionToState(state, condition)
  }

  if (isInCondition(condition)) {
    return appendInConditionToState(state, condition)
  }

  return state
}
