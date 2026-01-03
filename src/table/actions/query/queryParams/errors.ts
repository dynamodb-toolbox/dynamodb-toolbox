import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidReverseOptionErrorBlueprint = ErrorBlueprint<{
  code: 'queryCommand.invalidReverseOption'
  hasPath: false
  payload: { reverse?: unknown }
}>

type InvalidTagEntitiesOptionErrorBlueprint = ErrorBlueprint<{
  code: 'queryCommand.invalidTagEntitiesOption'
  hasPath: false
  payload: { tagEntities?: unknown }
}>

type InvalidProjectionExpressionErrorBlueprint = ErrorBlueprint<{
  code: 'queryCommand.invalidProjectionExpression'
  hasPath: false
  payload: { entity: string }
}>

type InvalidIndexErrorBlueprint = ErrorBlueprint<{
  code: 'queryCommand.invalidIndex'
  hasPath: false
  payload: { received: unknown; expected?: string[] }
}>

type InvalidPartitionErrorBlueprint = ErrorBlueprint<{
  code: 'queryCommand.invalidPartition'
  hasPath: false
  payload: { partition?: unknown }
}>

type InvalidRangeErrorBlueprint = ErrorBlueprint<{
  code: 'queryCommand.invalidRange'
  hasPath: false
  payload: { range?: unknown }
}>

export type QueryCommandParamsErrorBlueprints =
  | InvalidReverseOptionErrorBlueprint
  | InvalidTagEntitiesOptionErrorBlueprint
  | InvalidProjectionExpressionErrorBlueprint
  | InvalidIndexErrorBlueprint
  | InvalidPartitionErrorBlueprint
  | InvalidRangeErrorBlueprint
