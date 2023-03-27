import type { Condition } from 'v1/commands/condition/types'

import type { ConditionParsingState } from './parsingState'
import { isComparisonCondition, appendComparisonCondition } from './comparison'
import { isSingleArgFnCondition, appendSingleArgFnCondition } from './singleArgFn'
import { isBetweenCondition, appendBetweenCondition } from './between'
import { isNotCondition, appendNotCondition } from './not'
import {
  isLogicalCombinationCondition,
  appendLogicalCombinationCondition
} from './logicalCombination'
import { isTwoArgsFnCondition, appendTwoArgsFnCondition } from './twoArgsFn'
import { isInCondition, appendInCondition } from './in'

export const appendCondition = (state: ConditionParsingState, condition: Condition): void => {
  if (isComparisonCondition(condition)) {
    return appendComparisonCondition(state, condition)
  }

  if (isSingleArgFnCondition(condition)) {
    return appendSingleArgFnCondition(state, condition)
  }

  if (isBetweenCondition(condition)) {
    return appendBetweenCondition(state, condition)
  }

  if (isNotCondition(condition)) {
    return appendNotCondition(state, condition)
  }

  if (isLogicalCombinationCondition(condition)) {
    return appendLogicalCombinationCondition(state, condition)
  }

  if (isTwoArgsFnCondition(condition)) {
    return appendTwoArgsFnCondition(state, condition)
  }

  if (isInCondition(condition)) {
    return appendInCondition(state, condition)
  }
}
