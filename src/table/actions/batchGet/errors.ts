import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidProjectionExpressionErrorBlueprint = ErrorBlueprint<{
  code: 'batchGetCommand.invalidProjectionExpression'
  hasPath: false
  payload: { entity: string }
}>

/** Union of every error blueprint a `BatchGetCommand` can raise. */
export type BatchGetCommandErrorBlueprints = InvalidProjectionExpressionErrorBlueprint
