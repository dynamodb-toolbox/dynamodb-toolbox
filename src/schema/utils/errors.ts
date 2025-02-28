import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidPropErrorBlueprint = ErrorBlueprint<{
  code: 'schema.invalidProp'
  hasPath: true
  payload: {
    propName: string
    expected?: unknown
    received: unknown
  }
}>

export type SharedSchemaErrorBlueprint = InvalidPropErrorBlueprint
