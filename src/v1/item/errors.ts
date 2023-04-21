import type { AttributeErrorBlueprints } from './attributes/errors'

import type { ErrorBlueprint } from 'v1/errors/blueprint'

type DuplicateSavedAsErrorBlueprint = ErrorBlueprint<{
  code: 'item.duplicateSavedAsAttributes'
  hasPath: false
  payload: { savedAs: string }
}>

export type ItemErrorBlueprints = AttributeErrorBlueprints | DuplicateSavedAsErrorBlueprint
