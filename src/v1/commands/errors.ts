import type { ErrorBlueprint } from 'v1/errors/blueprint'

import { GetItemCommandErrorBlueprints } from './getItem/errors'
import { PutItemCommandErrorBlueprints } from './putItem/errors'

type InvalidCapacityCommandOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidCapacityCommandOption'
  hasPath: false
  payload: { capacity: unknown }
}>

type UnknownCommandOptionErrorBlueprint = ErrorBlueprint<{
  code: 'unknownCommandOption'
  hasPath: false
  payload: { option: unknown }
}>

export type CommandErrorBlueprints =
  | GetItemCommandErrorBlueprints
  | PutItemCommandErrorBlueprints
  | InvalidCapacityCommandOptionErrorBlueprint
  | UnknownCommandOptionErrorBlueprint
