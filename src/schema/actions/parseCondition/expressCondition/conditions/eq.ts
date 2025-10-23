import type { SchemaCondition } from '../../condition.js'
import type { ConditionExpression } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { attrOrValueTokens, pathTokens, valueToken } from './utils.js'

export const expressEqCondition = (
  condition: Extract<SchemaCondition, { eq: unknown }>,
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

  ConditionExpression += ' = '
  ConditionExpression += attrOrValueTokens(condition.eq, prefix, state)

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}

export const expressNeCondition = (
  condition: Extract<SchemaCondition, { ne: unknown }>,
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

  ConditionExpression += ' <> '
  ConditionExpression += attrOrValueTokens(condition.ne, prefix, state)

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
