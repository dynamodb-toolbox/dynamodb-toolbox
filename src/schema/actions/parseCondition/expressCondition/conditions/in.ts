import type { SchemaCondition } from '../../condition.js'
import type { ConditionExpression } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { attrOrValueTokens, pathTokens, valueToken } from './utils.js'

export const expressInCondition = (
  condition: Extract<SchemaCondition, { in: unknown }>,
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

  ConditionExpression += ' IN ('
  ConditionExpression += condition.in
    .map(inValue => attrOrValueTokens(inValue, prefix, state))
    .join(', ')
  ConditionExpression += ')'

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
