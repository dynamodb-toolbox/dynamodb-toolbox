import type { SchemaCondition } from '../../condition.js'
import type { ConditionExpression } from '../../types.js'
import type { ExpressionState } from '../types.js'
import { attrOrValueTokens, pathTokens } from './utils.js'

export const expressEqCondition = (
  condition: Extract<SchemaCondition, { eq: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  const { eq } = condition
  const size = 'size' in condition
  const attr = size ? condition.size : condition.attr

  ConditionExpression += pathTokens(attr, prefix, state, size)
  ConditionExpression += ' = '
  ConditionExpression += attrOrValueTokens(eq, prefix, state)

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}

export const expressNeCondition = (
  condition: Extract<SchemaCondition, { ne: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  const { ne } = condition
  const size = 'size' in condition
  const attr = size ? condition.size : condition.attr

  ConditionExpression += pathTokens(attr, prefix, state, size)
  ConditionExpression += ' <> '
  ConditionExpression += attrOrValueTokens(ne, prefix, state)

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
