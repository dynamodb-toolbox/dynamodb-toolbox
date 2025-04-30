import type { SchemaCondition } from '../../condition.js'
import type { ConditionExpression } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { attrOrValueTokens, pathTokens } from './utils.js'

export const expressGteCondition = (
  condition: Extract<SchemaCondition, { gte: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  const { gte } = condition
  const size = 'size' in condition
  const attr = size ? condition.size : condition.attr

  ConditionExpression += pathTokens(attr, prefix, state, size)
  ConditionExpression += ' >= '
  ConditionExpression += attrOrValueTokens(gte, prefix, state)

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

  const { gt } = condition
  const size = 'size' in condition
  const attr = size ? condition.size : condition.attr

  ConditionExpression += pathTokens(attr, prefix, state, size)
  ConditionExpression += ' > '
  ConditionExpression += attrOrValueTokens(gt, prefix, state)

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

  const { lte } = condition
  const size = 'size' in condition
  const attr = size ? condition.size : condition.attr

  ConditionExpression += pathTokens(attr, prefix, state, size)
  ConditionExpression += ' <= '
  ConditionExpression += attrOrValueTokens(lte, prefix, state)

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

  const { lt } = condition
  const size = 'size' in condition
  const attr = size ? condition.size : condition.attr

  ConditionExpression += pathTokens(attr, prefix, state, size)
  ConditionExpression += ' < '
  ConditionExpression += attrOrValueTokens(lt, prefix, state)

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
