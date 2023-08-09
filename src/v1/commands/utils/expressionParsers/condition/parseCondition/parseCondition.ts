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

export const parseCondition = (conditionParser: ConditionParser, condition: Condition): void => {
  if (isComparisonCondition(condition)) {
    return parseComparisonCondition(conditionParser, condition)
  }

  if (isSingleArgFnCondition(condition)) {
    return parseSingleArgFnCondition(conditionParser, condition)
  }

  if (isBetweenCondition(condition)) {
    return parseBetweenCondition(conditionParser, condition)
  }

  if (isNotCondition(condition)) {
    return parseNotCondition(conditionParser, condition)
  }

  if (isLogicalCombinationCondition(condition)) {
    return parseLogicalCombinationCondition(conditionParser, condition)
  }

  if (isTwoArgsFnCondition(condition)) {
    return parseTwoArgsFnCondition(conditionParser, condition)
  }

  if (isInCondition(condition)) {
    return parseInCondition(conditionParser, condition)
  }
}
