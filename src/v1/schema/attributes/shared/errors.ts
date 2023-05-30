import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidPropertyErrorBlueprint = ErrorBlueprint<{
  code: 'schema.attribute.invalidProperty'
  hasPath: true
  payload: {
    propertyName: string
    expected?: unknown
    received: unknown
  }
}>

export type SharedAttributeErrorBlueprints = InvalidPropertyErrorBlueprint
