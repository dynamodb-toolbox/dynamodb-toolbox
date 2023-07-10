import type { Condition } from 'v1/commands/types'

import type { ConditionParser } from '../conditionParser'
import { isComparisonCondition, parseComparisonCondition } from './comparison'
import { isSingleArgFnCondition, parseSingleArgFnCondition } from './singleArgFn'
import { isBetweenCondition, parseBetweenCondition } from './between'
import { isNotCondition, parseNotCondition } from './not'
import {
  isLogicalCombinationCondition,
  parseLogicalCombinationCondition
} from './logicalCombination'
import { isTwoArgsFnCondition, parseTwoArgsFnCondition } from './twoArgsFn'
import { isInCondition, parseInCondition } from './in'

export const parseCondition = (state: ConditionParser, condition: Condition): void => {
  if (isComparisonCondition(condition)) {
    return parseComparisonCondition(state, condition)
  }

  if (isSingleArgFnCondition(condition)) {
    return parseSingleArgFnCondition(state, condition)
  }

  if (isBetweenCondition(condition)) {
    return parseBetweenCondition(state, condition)
  }

  if (isNotCondition(condition)) {
    return parseNotCondition(state, condition)
  }

  if (isLogicalCombinationCondition(condition)) {
    return parseLogicalCombinationCondition(state, condition)
  }

  if (isTwoArgsFnCondition(condition)) {
    return parseTwoArgsFnCondition(state, condition)
  }

  if (isInCondition(condition)) {
    return parseInCondition(state, condition)
  }
}
