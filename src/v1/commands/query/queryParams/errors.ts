import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidReverseOptionErrorBlueprint = ErrorBlueprint<{
  code: 'queryCommand.invalidReverseOption'
  hasPath: false
  payload: { reverse?: unknown }
}>

export type QueryCommandErrorBlueprints = InvalidReverseOptionErrorBlueprint
