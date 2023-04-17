import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidItemErrorBlueprint = ErrorBlueprint<{
  code: 'putItemCommand.invalidItem'
  hasPath: false
  payload: {
    received: unknown
    expected?: unknown
  }
}>

type AttributeRequiredErrorBlueprint = ErrorBlueprint<{
  code: 'putItemCommand.attributeRequired'
  hasPath: true
  payload: undefined
}>

type InvalidAttributeInputErrorBlueprint = ErrorBlueprint<{
  code: 'putItemCommand.invalidAttributeInput'
  hasPath: true
  payload: {
    received: unknown
    expected?: unknown
  }
}>

export type PutItemCommandErrorBlueprints =
  | InvalidItemErrorBlueprint
  | AttributeRequiredErrorBlueprint
  | InvalidAttributeInputErrorBlueprint
