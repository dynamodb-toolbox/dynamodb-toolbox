import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidConditionAttributePathErrorBlueprint = ErrorBlueprint<{
  code: 'invalidConditionAttributePath'
  hasPath: false
  payload: {
    attributePath: string
  }
}>

export type ConditionParserErrorBlueprints = InvalidConditionAttributePathErrorBlueprint
