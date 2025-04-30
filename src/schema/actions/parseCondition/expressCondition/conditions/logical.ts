import type { SchemaCondition } from '../../condition.js'
import type { ConditionExpression } from '../../types.js'
import { expressCondition } from '../expressCondition.js'
import type { ExpressionState } from '../types.js'

export const expressOrCondition = (
  condition: Extract<SchemaCondition, { or: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  const { or } = condition
  const [orHead, ...orTail] = or as [SchemaCondition, ...SchemaCondition[]]

  if (orTail.length === 0) {
    return expressCondition(orHead, prefix, state)
  }

  ConditionExpression += '('
  ConditionExpression += or
    .map(cond => expressCondition(cond, prefix, state).ConditionExpression)
    .join(') OR (')
  ConditionExpression += ')'

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}

export const expressAndCondition = (
  condition: Extract<SchemaCondition, { and: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  const { and } = condition
  const [andHead, ...andTail] = and as [SchemaCondition, ...SchemaCondition[]]

  if (andTail.length === 0) {
    return expressCondition(andHead, prefix, state)
  }

  ConditionExpression += '('
  ConditionExpression += and
    .map(cond => expressCondition(cond, prefix, state).ConditionExpression)
    .join(') AND (')
  ConditionExpression += ')'

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}

export const expressNotCondition = (
  condition: Extract<SchemaCondition, { not: unknown }>,
  prefix = '',
  state: ExpressionState
): ConditionExpression => {
  let ConditionExpression = ''

  const { not } = condition

  ConditionExpression += 'NOT ('
  ConditionExpression += expressCondition(not, prefix, state).ConditionExpression
  ConditionExpression += ')'

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
