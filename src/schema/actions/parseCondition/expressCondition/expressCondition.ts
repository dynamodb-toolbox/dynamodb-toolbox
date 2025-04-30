import { DynamoDBToolboxError } from '~/errors/index.js'

import type { SchemaCondition } from '../condition.js'
import type { ConditionExpression } from '../types.js'
import type { ExpressionState } from './types.js'
import { attrOrValueTokens, pathTokens, valueToken } from './utils.js'

export const expressCondition = (
  condition: SchemaCondition,
  prefix = '',
  state: ExpressionState = {
    namesCursor: 1,
    valuesCursor: 1,
    tokens: {},
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {}
  }
): ConditionExpression => {
  let ConditionExpression = ''

  switch (true) {
    case 'eq' in condition: {
      const { eq } = condition
      const size = 'size' in condition
      const attr = size ? condition.size : condition.attr

      ConditionExpression += pathTokens(attr, prefix, state, size)
      ConditionExpression += ' = '
      ConditionExpression += attrOrValueTokens(eq, prefix, state)
      break
    }
    case 'ne' in condition: {
      const { ne } = condition
      const size = 'size' in condition
      const attr = size ? condition.size : condition.attr

      ConditionExpression += pathTokens(attr, prefix, state, size)
      ConditionExpression += ' <> '
      ConditionExpression += attrOrValueTokens(ne, prefix, state)
      break
    }
    case 'gte' in condition: {
      const { gte } = condition
      const size = 'size' in condition
      const attr = size ? condition.size : condition.attr

      ConditionExpression += pathTokens(attr, prefix, state, size)
      ConditionExpression += ' >= '
      ConditionExpression += attrOrValueTokens(gte, prefix, state)
      break
    }
    case 'gt' in condition: {
      const { gt } = condition
      const size = 'size' in condition
      const attr = size ? condition.size : condition.attr

      ConditionExpression += pathTokens(attr, prefix, state, size)
      ConditionExpression += ' > '
      ConditionExpression += attrOrValueTokens(gt, prefix, state)
      break
    }
    case 'lte' in condition: {
      const { lte } = condition
      const size = 'size' in condition
      const attr = size ? condition.size : condition.attr

      ConditionExpression += pathTokens(attr, prefix, state, size)
      ConditionExpression += ' <= '
      ConditionExpression += attrOrValueTokens(lte, prefix, state)
      break
    }
    case 'lt' in condition: {
      const { lt } = condition
      const size = 'size' in condition
      const attr = size ? condition.size : condition.attr

      ConditionExpression += pathTokens(attr, prefix, state, size)
      ConditionExpression += ' < '
      ConditionExpression += attrOrValueTokens(lt, prefix, state)
      break
    }
    case 'between' in condition: {
      const { between } = condition
      const [left, right] = between
      const size = 'size' in condition
      const attr = size ? condition.size : condition.attr

      ConditionExpression += pathTokens(attr, prefix, state, size)
      ConditionExpression += ' BETWEEN '
      ConditionExpression += attrOrValueTokens(left, prefix, state)
      ConditionExpression += ' AND '
      ConditionExpression += attrOrValueTokens(right, prefix, state)
      break
    }
    case 'beginsWith' in condition: {
      const { attr, beginsWith } = condition

      ConditionExpression += 'begins_with('
      ConditionExpression += pathTokens(attr, prefix, state)
      ConditionExpression += ', '
      ConditionExpression += attrOrValueTokens(beginsWith, prefix, state)
      ConditionExpression += ')'
      break
    }
    case 'in' in condition: {
      const { in: range } = condition
      const size = 'size' in condition
      const attr = size ? condition.size : condition.attr

      ConditionExpression += pathTokens(attr, prefix, state, size)
      ConditionExpression += ' IN ('
      ConditionExpression += range
        .map(rangeValue => attrOrValueTokens(rangeValue, prefix, state))
        .join(', ')
      ConditionExpression += ')'
      break
    }
    case 'contains' in condition: {
      const { attr, contains } = condition

      ConditionExpression += 'contains('
      ConditionExpression += pathTokens(attr, prefix, state)
      ConditionExpression += ', '
      ConditionExpression += attrOrValueTokens(contains, prefix, state)
      ConditionExpression += ')'
      break
    }
    case 'exists' in condition: {
      const { attr, exists } = condition

      ConditionExpression += exists ? 'attribute_exists(' : 'attribute_not_exists('
      ConditionExpression += pathTokens(attr, prefix, state)
      ConditionExpression += ')'
      break
    }
    case 'type' in condition: {
      const { attr, type } = condition

      ConditionExpression += 'attribute_type('
      ConditionExpression += pathTokens(attr, prefix, state)
      ConditionExpression += ', '
      ConditionExpression += valueToken(type, prefix, state)
      ConditionExpression += ')'
      break
    }
    case 'or' in condition: {
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
      break
    }
    case 'and' in condition: {
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
      break
    }
    case 'not' in condition: {
      const { not } = condition

      ConditionExpression += 'NOT ('
      ConditionExpression += expressCondition(not, prefix, state).ConditionExpression
      ConditionExpression += ')'
      break
    }
    default:
      throw new DynamoDBToolboxError('actions.invalidCondition', {
        message: 'Invalid condition: Unable to detect valid condition type.'
      })
  }

  return {
    ConditionExpression,
    ExpressionAttributeNames: state.ExpressionAttributeNames,
    ExpressionAttributeValues: state.ExpressionAttributeValues
  }
}
