import type { Entity } from '~/entity/index.js'

import type { ConditionCheckFailedError } from './isConditionCheckFailed.js'
import { isConditionCheckFailed } from './isConditionCheckFailed.js'

export type AssertConditionCheckFailed = <ENTITY extends Entity = Entity>(
  error: unknown,
  entity?: ENTITY
) => asserts error is ConditionCheckFailedError<ENTITY>

export const assertConditionCheckFailed: AssertConditionCheckFailed = (error, entity) => {
  if (!isConditionCheckFailed(error, entity)) {
    throw error
  }
}
