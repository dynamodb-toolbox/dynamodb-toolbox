import type { SchemaCondition } from '../../condition.js'
import type { ConditionExpression } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { attrOrValueTokens, pathTokens, valueToken } from './utils.js'

export const expressGteCondition = (
  condition: Extract<SchemaCondition, { gte: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  if ('value' in condition) {
    ConditionExpression += valueToken(condition.value, prefix, state)
  } else {
    const size = 'size' in condition
    ConditionExpression += pathTokens(size ? condition.size : condition.attr, prefix, state, size)
  }

  ConditionExpression += ' >= '
  ConditionExpression += attrOrValueTokens(condition.gte, prefix, state)

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}

export const expressGtCondition = (
  condition: Extract<SchemaCondition, { gt: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  if ('value' in condition) {
    ConditionExpression += valueToken(condition.value, prefix, state)
  } else {
    const size = 'size' in condition
    ConditionExpression += pathTokens(size ? condition.size : condition.attr, prefix, state, size)
  }

  ConditionExpression += ' > '
  ConditionExpression += attrOrValueTokens(condition.gt, prefix, state)

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}

export const expressLteCondition = (
  condition: Extract<SchemaCondition, { lte: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  if ('value' in condition) {
    ConditionExpression += valueToken(condition.value, prefix, state)
  } else {
    const size = 'size' in condition
    ConditionExpression += pathTokens(size ? condition.size : condition.attr, prefix, state, size)
  }

  ConditionExpression += ' <= '
  ConditionExpression += attrOrValueTokens(condition.lte, prefix, state)

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}

export const expressLtCondition = (
  condition: Extract<SchemaCondition, { lt: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  if ('value' in condition) {
    ConditionExpression += valueToken(condition.value, prefix, state)
  } else {
    const size = 'size' in condition
    ConditionExpression += pathTokens(size ? condition.size : condition.attr, prefix, state, size)
  }

  ConditionExpression += ' < '
  ConditionExpression += attrOrValueTokens(condition.lt, prefix, state)

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
