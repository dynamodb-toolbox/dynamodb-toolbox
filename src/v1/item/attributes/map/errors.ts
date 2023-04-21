import type { ErrorBlueprint } from 'v1/errors/blueprint'

type DuplicateSavedAsErrorBlueprint = ErrorBlueprint<{
  code: 'item.mapAttribute.duplicateSavedAs'
  hasPath: true
  payload: { savedAs: string }
}>

export type MapAttributeErrorBlueprints = DuplicateSavedAsErrorBlueprint
