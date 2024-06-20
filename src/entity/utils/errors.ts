import type { ErrorBlueprint } from '~/errors/blueprint.js'

type ReservedAttributeNameErrorBlueprint = ErrorBlueprint<{
  code: 'entity.reservedAttributeName'
  hasPath: true
  payload: undefined
}>

type ReservedAttributeSavedAsErrorBlueprint = ErrorBlueprint<{
  code: 'entity.reservedAttributeSavedAs'
  hasPath: true
  payload: undefined
}>

type InvalidSchemaErrorBlueprint = ErrorBlueprint<{
  code: 'entity.invalidSchema'
  hasPath: false
  payload: undefined
}>

export type EntityUtilsErrorBlueprints =
  | ReservedAttributeNameErrorBlueprint
  | ReservedAttributeSavedAsErrorBlueprint
  | InvalidSchemaErrorBlueprint
