import type { SchemaCondition } from '../../condition.js'
import type { ConditionExpression } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { attrOrValueTokens, pathTokens, valueToken } from './utils.js'

export const expressBeginsWithCondition = (
  condition: Extract<SchemaCondition, { beginsWith: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  ConditionExpression += 'begins_with('

  if ('value' in condition) {
    ConditionExpression += valueToken(condition.value, prefix, state)
  } else {
    ConditionExpression += pathTokens(condition.attr, prefix, state)
  }

  ConditionExpression += ', '
  ConditionExpression += attrOrValueTokens(condition.beginsWith, prefix, state)
  ConditionExpression += ')'

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
