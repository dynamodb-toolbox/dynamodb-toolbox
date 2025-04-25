import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidProjectionExpressionErrorBlueprint = ErrorBlueprint<{
  code: 'batchGetCommand.invalidProjectionExpression'
  hasPath: false
  payload: { entity: string }
}>

export type BatchGetCommandErrorBlueprints = InvalidProjectionExpressionErrorBlueprint
