import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidItemErrorBlueprint = ErrorBlueprint<{
  code: 'commands.parseKeyInput.invalidItem'
  hasPath: false
  payload: {
    received: unknown
    expected?: unknown
  }
}>

type AttributeRequiredErrorBlueprint = ErrorBlueprint<{
  code: 'commands.parseKeyInput.attributeRequired'
  hasPath: true
  payload: undefined
}>

type InvalidAttributeInputErrorBlueprint = ErrorBlueprint<{
  code: 'commands.parseKeyInput.invalidAttributeInput'
  hasPath: true
  payload: {
    received: unknown
    expected?: unknown
  }
}>

export type ParseKeyInputErrorBlueprints =
  | InvalidItemErrorBlueprint
  | AttributeRequiredErrorBlueprint
  | InvalidAttributeInputErrorBlueprint
