import type { SchemaCondition } from '../../condition.js'
import type { ConditionExpression } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { attrOrValueTokens, pathTokens } from './utils.js'

export const expressInCondition = (
  condition: Extract<SchemaCondition, { in: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  const { in: range } = condition
  const size = 'size' in condition
  const attr = size ? condition.size : condition.attr

  ConditionExpression += pathTokens(attr, prefix, state, size)
  ConditionExpression += ' IN ('
  ConditionExpression += range
    .map(rangeValue => attrOrValueTokens(rangeValue, prefix, state))
    .join(', ')
  ConditionExpression += ')'

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
