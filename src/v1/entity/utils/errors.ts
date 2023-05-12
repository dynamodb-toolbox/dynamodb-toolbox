import type { ErrorBlueprint } from 'v1/errors/blueprint'

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

type InvalidItemSchemaErrorBlueprint = ErrorBlueprint<{
  code: 'entity.invalidItemSchema'
  hasPath: false
  payload: undefined
}>

export type EntityUtilsErrorBlueprints =
  | ReservedAttributeNameErrorBlueprint
  | ReservedAttributeSavedAsErrorBlueprint
  | InvalidItemSchemaErrorBlueprint
