import type { SchemaCondition } from '../../condition.js'
import type { ConditionExpression } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { attrOrValueTokens, pathTokens } from './utils.js'

export const expressContainsCondition = (
  condition: Extract<SchemaCondition, { contains: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  const { attr, contains } = condition

  ConditionExpression += 'contains('
  ConditionExpression += pathTokens(attr, prefix, state)
  ConditionExpression += ', '
  ConditionExpression += attrOrValueTokens(contains, prefix, state)
  ConditionExpression += ')'

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
