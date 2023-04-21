import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidItemErrorBlueprint = ErrorBlueprint<{
  code: 'commands.putItem.invalidItem'
  hasPath: false
  payload: {
    received: unknown
    expected?: unknown
  }
}>

type AttributeRequiredErrorBlueprint = ErrorBlueprint<{
  code: 'commands.putItem.attributeRequired'
  hasPath: true
  payload: undefined
}>

type InvalidAttributeInputErrorBlueprint = ErrorBlueprint<{
  code: 'commands.putItem.invalidAttributeInput'
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
