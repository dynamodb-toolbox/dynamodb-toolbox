import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidAttributePropertyErrorBlueprint = ErrorBlueprint<{
  code: 'invalidAttributeProperty'
  hasPath: true
  payload: {
    propertyName: string
    expected?: unknown
    received: unknown
  }
}>

export type SharedAttributeErrorBlueprints = InvalidAttributePropertyErrorBlueprint
