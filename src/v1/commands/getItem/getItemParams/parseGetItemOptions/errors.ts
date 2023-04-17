import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidConsistentOptionErrorBlueprint = ErrorBlueprint<{
  code: 'getItemCommand.invalidConsistentOption'
  hasPath: false
  payload: { consistent: unknown }
}>

export type GetItemCommandErrorBlueprints = InvalidConsistentOptionErrorBlueprint
