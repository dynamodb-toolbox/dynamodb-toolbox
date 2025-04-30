import { DynamoDBToolboxError } from '~/errors/index.js'

import type { SchemaCondition } from '../condition.js'
import type { ConditionExpression } from '../types.js'
import { expressBeginsWithCondition } from './conditions/beginsWith.js'
import { expressBetweenCondition } from './conditions/between.js'
import { expressContainsCondition } from './conditions/contains.js'
import { expressEqCondition, expressNeCondition } from './conditions/eq.js'
import { expressExistsCondition } from './conditions/exists.js'
import { expressInCondition } from './conditions/in.js'
import {
  expressAndCondition,
  expressNotCondition,
  expressOrCondition
} from './conditions/logical.js'
import {
  expressGtCondition,
  expressGteCondition,
  expressLtCondition,
  expressLteCondition
} from './conditions/range.js'
import { expressTypeCondition } from './conditions/type.js'
import type { ExpressionState } from './types.js'

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
  if ('or' in condition) {
    return expressOrCondition(condition, prefix, state)
  }

  if ('and' in condition) {
    return expressAndCondition(condition, prefix, state)
  }

  if ('not' in condition) {
    return expressNotCondition(condition, prefix, state)
  }

  if ('eq' in condition) {
    return expressEqCondition(condition, prefix, state)
  }

  if ('ne' in condition) {
    return expressNeCondition(condition, prefix, state)
  }

  if ('gte' in condition) {
    return expressGteCondition(condition, prefix, state)
  }

  if ('gt' in condition) {
    return expressGtCondition(condition, prefix, state)
  }

  if ('lte' in condition) {
    return expressLteCondition(condition, prefix, state)
  }

  if ('lt' in condition) {
    return expressLtCondition(condition, prefix, state)
  }

  if ('between' in condition) {
    return expressBetweenCondition(condition, prefix, state)
  }

  if ('beginsWith' in condition) {
    return expressBeginsWithCondition(condition, prefix, state)
  }

  if ('in' in condition) {
    return expressInCondition(condition, prefix, state)
  }

  if ('contains' in condition) {
    return expressContainsCondition(condition, prefix, state)
  }

  if ('exists' in condition) {
    return expressExistsCondition(condition, prefix, state)
  }

  if ('type' in condition) {
    return expressTypeCondition(condition, prefix, state)
  }

  throw new DynamoDBToolboxError('actions.invalidCondition', {
    message: 'Invalid condition: Unable to detect valid condition type.'
  })
}
