import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidExpressionAttributePathErrorBlueprint = ErrorBlueprint<{
  code: 'actions.invalidExpressionAttributePath'
  hasPath: false
  payload: {
    attributePath: string
  }
}>

/**
 * Union of error blueprints raised by shared schema-action utils.
 */
export type SchemaActionUtilsErrorBlueprints = InvalidExpressionAttributePathErrorBlueprint
