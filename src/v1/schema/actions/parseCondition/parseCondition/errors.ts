import type { ErrorBlueprint } from 'v1/errors/blueprint.js'

type InvalidConditionErrorBlueprint = ErrorBlueprint<{
  code: 'actions.invalidCondition'
  hasPath: false
  payload: undefined
}>

export type ConditionParserErrorBlueprints = InvalidConditionErrorBlueprint
