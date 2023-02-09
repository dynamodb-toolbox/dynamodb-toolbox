import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidPutItemCommandReturnValuesOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidPutItemCommandReturnValuesOption'
  hasPath: false
  payload: { returnValues: unknown }
}>

export type ParsePutItemCommandOptionsErrorBlueprints = InvalidPutItemCommandReturnValuesOptionErrorBlueprint
