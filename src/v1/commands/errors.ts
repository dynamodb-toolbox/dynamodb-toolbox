import type { ErrorBlueprint } from 'v1/errors/blueprint'

import { GetItemCommandErrorBlueprints } from './getItem/errors'
import { PutItemCommandErrorBlueprints } from './putItem/errors'

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

type UnknownCommandOptionErrorBlueprint = ErrorBlueprint<{
  code: 'unknownCommandOption'
  hasPath: false
  payload: { option: unknown }
}>

export type CommandErrorBlueprints =
  | GetItemCommandErrorBlueprints
  | PutItemCommandErrorBlueprints
  | InvalidCommandCapacityOptionErrorBlueprint
  | InvalidCommandMetricsOptionErrorBlueprint
  | UnknownCommandOptionErrorBlueprint
