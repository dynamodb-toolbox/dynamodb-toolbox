import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidConditionErrorBlueprint = ErrorBlueprint<{
  code: 'commands.invalidCondition'
  hasPath: false
  payload: undefined
}>

export type ConditionParserErrorBlueprints = InvalidConditionErrorBlueprint
