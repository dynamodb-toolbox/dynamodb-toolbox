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

/**
 * Error blueprint raised when validating any schema prop.
 */
export type SharedSchemaErrorBlueprint = InvalidPropErrorBlueprint
