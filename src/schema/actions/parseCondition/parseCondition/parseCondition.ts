import { DynamoDBToolboxError } from '~/errors/index.js'

import type { SchemaCondition } from '../condition.js'
import type { ConditionParser } from '../conditionParser.js'
import { isBetweenCondition, parseBetweenCondition } from './between/index.js'
import { isComparisonCondition, parseComparisonCondition } from './comparison/index.js'
import { isInCondition, parseInCondition } from './in/index.js'
import {
  isLogicalCombinationCondition,
  parseLogicalCombinationCondition
} from './logicalCombination/index.js'
import { isNotCondition, parseNotCondition } from './not/index.js'
import { isSingleArgFnCondition, parseSingleArgFnCondition } from './singleArgFn/index.js'
import { isTwoArgsFnCondition, parseTwoArgsFnCondition } from './twoArgsFn/index.js'

export const parseCondition = (
  conditionParser: ConditionParser,
  condition: SchemaCondition
): void => {
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

  throw new DynamoDBToolboxError('actions.invalidCondition', {
    message: 'Invalid condition: Unable to detect valid condition type.'
  })
}
