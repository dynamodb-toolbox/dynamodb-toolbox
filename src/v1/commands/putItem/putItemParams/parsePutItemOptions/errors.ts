import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidPutItemCommandMetricsOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidPutItemCommandMetricsOption'
  hasPath: false
  payload: { metrics: unknown }
}>

type InvalidPutItemReturnValuesOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidPutItemReturnValuesOption'
  hasPath: false
  payload: { returnValues: unknown }
}>

export type ParsePutItemCommandOptionsErrorBlueprints =
  | InvalidPutItemCommandMetricsOptionErrorBlueprint
  | InvalidPutItemReturnValuesOptionErrorBlueprint
