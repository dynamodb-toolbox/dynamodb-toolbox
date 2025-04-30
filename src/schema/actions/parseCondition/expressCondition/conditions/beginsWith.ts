import type { SchemaCondition } from '../../condition.js'
import type { ConditionExpression } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { attrOrValueTokens, pathTokens } from './utils.js'

export const expressBeginsWithCondition = (
  condition: Extract<SchemaCondition, { beginsWith: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  const { attr, beginsWith } = condition

  ConditionExpression += 'begins_with('
  ConditionExpression += pathTokens(attr, prefix, state)
  ConditionExpression += ', '
  ConditionExpression += attrOrValueTokens(beginsWith, prefix, state)
  ConditionExpression += ')'

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
