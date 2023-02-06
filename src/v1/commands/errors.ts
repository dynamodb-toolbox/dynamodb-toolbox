import type { ErrorBlueprint } from 'v1/errors/blueprint'

export * from './getItem/errors'
export * from './putItem/errors'

export type InvalidCapacityOptionErrorBlueprint = ErrorBlueprint<{
  code: 'invalidCapacityOption'
  hasPath: false
  payload: { capacity: unknown }
}>

export type UnknownOptionErrorBlueprint = ErrorBlueprint<{
  code: 'unknownOption'
  hasPath: false
  payload: { option: unknown }
}>
