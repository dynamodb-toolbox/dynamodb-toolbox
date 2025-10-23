import type { SchemaCondition } from '../../condition.js'
import type { ConditionExpression } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { attrOrValueTokens, pathTokens, valueToken } from './utils.js'

export const expressBetweenCondition = (
  condition: Extract<SchemaCondition, { between: unknown }>,
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

  const [left, right] = condition.between
  ConditionExpression += ' BETWEEN '
  ConditionExpression += attrOrValueTokens(left, prefix, state)
  ConditionExpression += ' AND '
  ConditionExpression += attrOrValueTokens(right, prefix, state)

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
