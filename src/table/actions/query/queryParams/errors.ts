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
  hasPath: true
  payload: { partition?: unknown }
}>

export type QueryCommandParamsErrorBlueprints =
  | InvalidReverseOptionErrorBlueprint
  | InvalidTagEntitiesOptionErrorBlueprint
  | InvalidProjectionExpressionErrorBlueprint
  | InvalidIndexErrorBlueprint
  | InvalidPartitionErrorBlueprint
