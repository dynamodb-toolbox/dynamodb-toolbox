import type { SchemaCondition } from '../../condition.js'
import type { ConditionExpression } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { pathTokens } from './utils.js'

export const expressExistsCondition = (
  condition: Extract<SchemaCondition, { exists: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  const { attr, exists } = condition

  ConditionExpression += exists ? 'attribute_exists(' : 'attribute_not_exists('
  ConditionExpression += pathTokens(attr, prefix, state)
  ConditionExpression += ')'

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
