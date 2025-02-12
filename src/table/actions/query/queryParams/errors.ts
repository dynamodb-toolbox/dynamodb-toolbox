import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidReverseOptionErrorBlueprint = ErrorBlueprint<{
  code: 'queryCommand.invalidReverseOption'
  hasPath: false
  payload: { reverse?: unknown }
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

export type QueryCommandErrorBlueprints =
  | InvalidReverseOptionErrorBlueprint
  | InvalidIndexErrorBlueprint
  | InvalidPartitionErrorBlueprint
