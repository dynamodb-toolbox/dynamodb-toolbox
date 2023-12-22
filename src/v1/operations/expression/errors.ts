import type { ErrorBlueprint } from 'v1/errors/blueprint'
import type { ConditionParserErrorBlueprints } from './condition/errors'

type InvalidExpressionAttributePathErrorBlueprint = ErrorBlueprint<{
  code: 'operations.invalidExpressionAttributePath'
  hasPath: false
  payload: {
    attributePath: string
  }
}>

export type ExpressionParsersErrorBlueprints =
  | ConditionParserErrorBlueprints
  | InvalidExpressionAttributePathErrorBlueprint
