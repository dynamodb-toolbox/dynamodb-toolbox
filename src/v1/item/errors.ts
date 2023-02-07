export * from './attributes/errors'

import type { ErrorBlueprint } from 'v1/errors/blueprint'

export type DuplicateSavedAsItemAttributesErrorBlueprint = ErrorBlueprint<{
  code: 'duplicateSavedAsItemAttributes'
  hasPath: false
  payload: { savedAs: string }
}>
