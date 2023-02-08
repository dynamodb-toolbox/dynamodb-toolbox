import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidGetItemCommandConsistentOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidGetItemCommandConsistentOption'
  hasPath: false
  payload: { consistent: unknown }
}>

export type ParseGetItemCommandOptionsErrorBlueprints = InvalidGetItemCommandConsistentOptionErrorBlueprint
