import type { SchemaCondition } from '../../condition.js'
import type { ConditionExpression } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { pathTokens, valueToken } from './utils.js'

export const expressTypeCondition = (
  condition: Extract<SchemaCondition, { type: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  const { attr, type } = condition

  ConditionExpression += 'attribute_type('
  ConditionExpression += pathTokens(attr, prefix, state)
  ConditionExpression += ', '
  ConditionExpression += valueToken(type, prefix, state)
  ConditionExpression += ')'

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
