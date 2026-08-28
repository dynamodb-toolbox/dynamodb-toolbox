import type { ErrorBlueprint } from '~/errors/blueprint.js'

type DuplicateSavedAsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.item.duplicateSavedAs'
  hasPath: true
  payload: { savedAs: string }
}>

/**
 * Error blueprint raised when validating an item schema.
 */
export type ItemSchemaErrorBlueprints = DuplicateSavedAsErrorBlueprint
