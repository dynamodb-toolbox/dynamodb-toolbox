import type { ErrorBlueprint } from '~/errors/blueprint.js'

type DuplicateSavedAsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.map.duplicateSavedAs'
  hasPath: true
  payload: { savedAs: string }
}>

export type MapSchemaErrorBlueprint = DuplicateSavedAsErrorBlueprint
