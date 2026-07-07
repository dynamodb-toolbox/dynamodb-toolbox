import type { ErrorBlueprint } from '~/errors/blueprint.js'

type UnrecognizedLiteralErrorBlueprint = ErrorBlueprint<{
  code: 'fromZodSchema.unrecognizedLiteral'
  hasPath: false
  payload: {
    received: unknown
  }
}>

type UnsupportedSetValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'fromZodSchema.unsupportedSetValueType'
  hasPath: false
  payload: {
    received: unknown
  }
}>

export type FromZodSchemaErrorBlueprints =
  | UnrecognizedLiteralErrorBlueprint
  | UnsupportedSetValueTypeErrorBlueprint
