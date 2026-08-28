import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidConditionErrorBlueprint = ErrorBlueprint<{
  code: 'actions.invalidCondition'
  hasPath: false
  payload: undefined
}>

/**
 * Error blueprint raised while transforming a condition.
 */
export type TransformConditionErrorBlueprints = InvalidConditionErrorBlueprint
