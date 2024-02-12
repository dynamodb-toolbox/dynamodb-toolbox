import type { AttributeErrorBlueprints } from './attributes/errors'
import type { ActionErrorBlueprints } from './actions/errors'
import type { ErrorBlueprint } from 'v1/errors/blueprint'

type DuplicateAttributeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.duplicateAttributeNames'
  hasPath: false
  payload: { name: string }
}>

type DuplicateSavedAsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.duplicateSavedAsAttributes'
  hasPath: false
  payload: { savedAs: string }
}>

export type SchemaErrorBlueprints =
  | AttributeErrorBlueprints
  | ActionErrorBlueprints
  | DuplicateAttributeErrorBlueprint
  | DuplicateSavedAsErrorBlueprint
