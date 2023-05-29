import type { ErrorBlueprint } from 'v1/errors/blueprint'

import type { GetItemCommandErrorBlueprints } from './getItem/errors'
import type { CommandUtilsErrorBlueprints } from './utils/errors'
import type { CommandClassesErrorBlueprints } from './classes/errors'

type IncompleteCommandErrorBlueprint = ErrorBlueprint<{
  code: 'commands.incompleteCommand'
  hasPath: false
  payload: undefined
}>

type InvalidCapacityOptionErrorBlueprint = ErrorBlueprint<{
  code: 'commands.invalidCapacityOption'
  hasPath: false
  payload: { capacity: unknown }
}>

type InvalidMetricsOptionErrorBlueprint = ErrorBlueprint<{
  code: 'commands.invalidMetricsOption'
  hasPath: false
  payload: { metrics: unknown }
}>

type InvalidReturnValuesOptionErrorBlueprint = ErrorBlueprint<{
  code: 'commands.invalidReturnValuesOption'
  hasPath: false
  payload: { returnValues: unknown }
}>

type UnknownOptionErrorBlueprint = ErrorBlueprint<{
  code: 'commands.unknownOption'
  hasPath: false
  payload: { option: unknown }
}>

export type CommandsErrorBlueprints =
  | GetItemCommandErrorBlueprints
  | CommandUtilsErrorBlueprints
  | CommandClassesErrorBlueprints
  | IncompleteCommandErrorBlueprint
  | InvalidCapacityOptionErrorBlueprint
  | InvalidMetricsOptionErrorBlueprint
  | InvalidReturnValuesOptionErrorBlueprint
  | UnknownOptionErrorBlueprint
