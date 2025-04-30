import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidConditionErrorBlueprint = ErrorBlueprint<{
  code: 'actions.invalidCondition'
  hasPath: false
  payload: undefined
}>

export type TransformConditionErrorBlueprints = InvalidConditionErrorBlueprint
