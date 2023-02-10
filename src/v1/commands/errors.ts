import type { ErrorBlueprint } from 'v1/errors/blueprint'

import { GetItemCommandErrorBlueprints } from './getItem/errors'

type InvalidCommandCapacityOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidCommandCapacityOption'
  hasPath: false
  payload: { capacity: unknown }
}>

type InvalidCommandMetricsOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidCommandMetricsOption'
  hasPath: false
  payload: { metrics: unknown }
}>

type InvalidCommandReturnValuesOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidCommandReturnValuesOption'
  hasPath: false
  payload: { returnValues: unknown }
}>

type UnknownCommandOptionErrorBlueprint = ErrorBlueprint<{
  code: 'unknownCommandOption'
  hasPath: false
  payload: { option: unknown }
}>

export type CommandErrorBlueprints =
  | GetItemCommandErrorBlueprints
  | InvalidCommandCapacityOptionErrorBlueprint
  | InvalidCommandMetricsOptionErrorBlueprint
  | InvalidCommandReturnValuesOptionErrorBlueprint
  | UnknownCommandOptionErrorBlueprint
