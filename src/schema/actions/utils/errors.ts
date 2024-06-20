import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidExpressionAttributePathErrorBlueprint = ErrorBlueprint<{
  code: 'actions.invalidExpressionAttributePath'
  hasPath: false
  payload: {
    attributePath: string
  }
}>

export type SchemaActionUtilsErrorBlueprints = InvalidExpressionAttributePathErrorBlueprint
