import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidSegmentOptionErrorBlueprint = ErrorBlueprint<{
  code: 'scanCommand.invalidSegmentOption'
  hasPath: false
  payload: { segment?: unknown; totalSegments?: unknown }
}>

type InvalidProjectionExpressionErrorBlueprint = ErrorBlueprint<{
  code: 'scanCommand.invalidProjectionExpression'
  hasPath: false
  payload: { entity: string }
}>

export type ScanCommandParamsErrorBlueprints =
  | InvalidSegmentOptionErrorBlueprint
  | InvalidProjectionExpressionErrorBlueprint
