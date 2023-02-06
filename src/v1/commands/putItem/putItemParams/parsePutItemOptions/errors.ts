import type { ErrorBlueprint } from 'v1/errors/blueprint'

export type InvalidCapacityOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidCapacityOption'
  hasPath: false
  payload: { capacity: unknown }
}>

export type InvalidMetricsOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidMetricsOption'
  hasPath: false
  payload: { metrics: unknown }
}>
