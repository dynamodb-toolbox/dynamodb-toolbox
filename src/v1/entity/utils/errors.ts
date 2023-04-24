import type { ErrorBlueprint } from 'v1/errors/blueprint'

type ReservedAttributeNameErrorBlueprint = ErrorBlueprint<{
  code: 'entity.reservedAttributeName'
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
  | InvalidItemSchemaErrorBlueprint
