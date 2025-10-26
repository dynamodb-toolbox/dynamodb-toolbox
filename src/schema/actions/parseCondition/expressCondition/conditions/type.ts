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

  ConditionExpression += 'attribute_type('

  if ('value' in condition) {
    ConditionExpression += valueToken(condition.value, prefix, state)
  } else {
    ConditionExpression += pathTokens(condition.attr, prefix, state)
  }

  ConditionExpression += ', '
  ConditionExpression += valueToken(condition.type, prefix, state)
  ConditionExpression += ')'

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
