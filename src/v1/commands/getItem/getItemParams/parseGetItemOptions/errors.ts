import type { ErrorBlueprint } from 'v1/errors/blueprint'

export type InvalidConsistentOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidConsistentOption'
  hasPath: false
  payload: { consistent: unknown }
}>
