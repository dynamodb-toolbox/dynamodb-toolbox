import type { ErrorBlueprint } from '~/errors/blueprint.js'

type DuplicateSavedAsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.item.duplicateSavedAs'
  hasPath: true
  payload: { savedAs: string }
}>

export type ItemSchemaErrorBlueprints = DuplicateSavedAsErrorBlueprint
