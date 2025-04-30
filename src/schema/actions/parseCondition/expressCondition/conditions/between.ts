import type { SchemaCondition } from '../../condition.js'
import type { ConditionExpression } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { attrOrValueTokens, pathTokens } from './utils.js'

export const expressBetweenCondition = (
  condition: Extract<SchemaCondition, { between: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  const { between } = condition
  const [left, right] = between
  const size = 'size' in condition
  const attr = size ? condition.size : condition.attr

  ConditionExpression += pathTokens(attr, prefix, state, size)
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
