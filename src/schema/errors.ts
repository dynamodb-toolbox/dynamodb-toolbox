import type { ErrorBlueprint } from '~/errors/blueprint.js'

import type { ActionErrorBlueprints } from './actions/errors.js'

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
  | ActionErrorBlueprints
  | DuplicateAttributeErrorBlueprint
  | DuplicateSavedAsErrorBlueprint
