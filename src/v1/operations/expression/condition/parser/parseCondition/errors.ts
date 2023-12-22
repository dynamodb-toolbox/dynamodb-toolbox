import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidConditionErrorBlueprint = ErrorBlueprint<{
  code: 'operations.invalidCondition'
  hasPath: false
  payload: undefined
}>

export type ConditionParserErrorBlueprints = InvalidConditionErrorBlueprint
