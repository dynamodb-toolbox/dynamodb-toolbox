import type { ErrorBlueprint } from 'v1/errors/blueprint'

import type { GetItemCommandErrorBlueprints } from './getItem/errors'
import type { PutItemCommandErrorBlueprints } from './putItem/errors'
import type { CommandUtilsErrorBlueprints } from './utils/errors'

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
  | PutItemCommandErrorBlueprints
  | CommandUtilsErrorBlueprints
  | InvalidCommandCapacityOptionErrorBlueprint
  | InvalidCommandMetricsOptionErrorBlueprint
  | InvalidCommandReturnValuesOptionErrorBlueprint
  | UnknownCommandOptionErrorBlueprint
