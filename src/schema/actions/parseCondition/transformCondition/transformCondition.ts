import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Schema } from '~/schema/index.js'

import type { SchemaCondition } from '../condition.js'
import { transformBeginsWithCondition } from './conditions/beginsWith.js'
import { transformBetweenCondition } from './conditions/between.js'
import { transformContainsCondition } from './conditions/contains.js'
import { transformEqCondition, transformNeCondition } from './conditions/eq.js'
import { transformExistsCondition } from './conditions/exists.js'
import { transformInCondition } from './conditions/in.js'
import {
  transformAndCondition,
  transformNotCondition,
  transformOrCondition
} from './conditions/logical.js'
import {
  transformGtCondition,
  transformGteCondition,
  transformLtCondition,
  transformLteCondition
} from './conditions/range.js'
import { transformTypeCondition } from './conditions/type.js'

export const transformCondition = (schema: Schema, condition: SchemaCondition): SchemaCondition => {
  if ('value' in condition) {
    return condition
  }

  if ('or' in condition) {
    return transformOrCondition(schema, condition)
  }

  if ('and' in condition) {
    return transformAndCondition(schema, condition)
  }

  if ('not' in condition) {
    return transformNotCondition(schema, condition)
  }

  if ('eq' in condition) {
    return transformEqCondition(schema, condition)
  }

  if ('ne' in condition) {
    return transformNeCondition(schema, condition)
  }

  if ('gte' in condition) {
    return transformGteCondition(schema, condition)
  }

  if ('gt' in condition) {
    return transformGtCondition(schema, condition)
  }

  if ('lte' in condition) {
    return transformLteCondition(schema, condition)
  }

  if ('lt' in condition) {
    return transformLtCondition(schema, condition)
  }

  if ('between' in condition) {
    return transformBetweenCondition(schema, condition)
  }

  if ('beginsWith' in condition) {
    return transformBeginsWithCondition(schema, condition)
  }

  if ('in' in condition) {
    return transformInCondition(schema, condition)
  }

  if ('contains' in condition) {
    return transformContainsCondition(schema, condition)
  }

  if ('exists' in condition) {
    return transformExistsCondition(schema, condition)
  }

  if ('type' in condition) {
    return transformTypeCondition(schema, condition)
  }

  throw new DynamoDBToolboxError('actions.invalidCondition', {
    message: 'Invalid condition: Unable to detect valid condition type.'
  })
}
