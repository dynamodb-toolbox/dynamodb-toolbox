import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidExpressionAttributePathErrorBlueprint = ErrorBlueprint<{
  code: 'operations.invalidExpressionAttributePath'
  hasPath: false
  payload: {
    attributePath: string
  }
}>

export type SchemaActionUtilsErrorBlueprints = InvalidExpressionAttributePathErrorBlueprint
