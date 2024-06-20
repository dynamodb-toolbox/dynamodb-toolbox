import type { ErrorBlueprint } from 'v1/errors/blueprint.js'

type InvalidItemErrorBlueprint = ErrorBlueprint<{
  code: 'parsing.invalidItem'
  hasPath: false
  payload: {
    received: unknown
    expected?: unknown
  }
}>

type AttributeRequiredErrorBlueprint = ErrorBlueprint<{
  code: 'parsing.attributeRequired'
  hasPath: true
  payload: undefined
}>

type InvalidAttributeInputErrorBlueprint = ErrorBlueprint<{
  code: 'parsing.invalidAttributeInput'
  hasPath: true
  payload: {
    received: unknown
    expected?: unknown
  }
}>

export type ParserErrorBlueprints =
  | InvalidItemErrorBlueprint
  | AttributeRequiredErrorBlueprint
  | InvalidAttributeInputErrorBlueprint
