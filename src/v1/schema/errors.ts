import type { AttributeErrorBlueprints } from './attributes/errors'

import type { ErrorBlueprint } from 'v1/errors/blueprint'

type DuplicateSavedAsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.duplicateSavedAsAttributes'
  hasPath: false
  payload: { savedAs: string }
}>

export type SchemaErrorBlueprints = AttributeErrorBlueprints | DuplicateSavedAsErrorBlueprint
