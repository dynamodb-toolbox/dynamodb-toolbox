import type { ErrorBlueprint } from 'v1/errors/blueprint'

type DuplicateSavedAsMapAttributesErrorBlueprint = ErrorBlueprint<{
  code: 'duplicateSavedAsMapAttributes'
  hasPath: true
  payload: { savedAs: string }
}>

export type MapAttributeErrorBlueprints = DuplicateSavedAsMapAttributesErrorBlueprint
