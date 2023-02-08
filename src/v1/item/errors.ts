import type { AttributeErrorBlueprints } from './attributes/errors'

import type { ErrorBlueprint } from 'v1/errors/blueprint'

type DuplicateSavedAsItemAttributesErrorBlueprint = ErrorBlueprint<{
  code: 'duplicateSavedAsItemAttributes'
  hasPath: false
  payload: { savedAs: string }
}>

export type ItemErrorBlueprints =
  | AttributeErrorBlueprints
  | DuplicateSavedAsItemAttributesErrorBlueprint
