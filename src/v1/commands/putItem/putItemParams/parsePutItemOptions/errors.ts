import type { ErrorBlueprint } from 'v1/errors/blueprint'

export type InvalidMetricsOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidMetricsOption'
  hasPath: false
  payload: { metrics: unknown }
}>

export type InvalidReturnValuesOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidReturnValuesOption'
  hasPath: false
  payload: { returnValues: unknown }
}>
