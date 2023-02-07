import type { ErrorBlueprint } from 'v1/errors/blueprint'

export type DuplicateSavedAsMapAttributesErrorBlueprint = ErrorBlueprint<{
  code: 'duplicateSavedAsMapAttributes'
  hasPath: true
  payload: { savedAs: string }
}>
