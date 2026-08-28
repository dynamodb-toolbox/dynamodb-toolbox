import type { ErrorBlueprint } from '~/errors/blueprint.js'

type DuplicateSavedAsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.map.duplicateSavedAs'
  hasPath: true
  payload: { savedAs: string }
}>

/**
 * Error blueprint raised when validating a map schema.
 */
export type MapSchemaErrorBlueprint = DuplicateSavedAsErrorBlueprint
