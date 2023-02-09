import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidPutItemCommandMetricsOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidPutItemCommandMetricsOption'
  hasPath: false
  payload: { metrics: unknown }
}>

type InvalidPutItemCommandReturnValuesOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidPutItemCommandReturnValuesOption'
  hasPath: false
  payload: { returnValues: unknown }
}>

export type ParsePutItemCommandOptionsErrorBlueprints =
  | InvalidPutItemCommandMetricsOptionErrorBlueprint
  | InvalidPutItemCommandReturnValuesOptionErrorBlueprint
