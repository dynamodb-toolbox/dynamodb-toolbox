import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidConditionAttributePathErrorBlueprint = ErrorBlueprint<{
  code: 'commands.invalidConditionAttributePath'
  hasPath: false
  payload: {
    attributePath: string
  }
}>

export type ConditionParserErrorBlueprints = InvalidConditionAttributePathErrorBlueprint
