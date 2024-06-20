import type { ErrorBlueprint } from 'v1/errors/blueprint.js'

type InvalidReverseOptionErrorBlueprint = ErrorBlueprint<{
  code: 'queryCommand.invalidReverseOption'
  hasPath: false
  payload: { reverse?: unknown }
}>

type InvalidPartitionErrorBlueprint = ErrorBlueprint<{
  code: 'queryCommand.invalidPartition'
  hasPath: true
  payload: { partition?: unknown }
}>

export type QueryCommandErrorBlueprints =
  | InvalidReverseOptionErrorBlueprint
  | InvalidPartitionErrorBlueprint
