import type { ErrorBlueprint } from 'v1/errors/blueprint'

export type InvalidDefaultValueErrorBlueprint = ErrorBlueprint<{
  code: 'invalidDefaultValue'
  hasPath: true
  payload: { expectedValues?: unknown[]; defaultValue: unknown }
}>
