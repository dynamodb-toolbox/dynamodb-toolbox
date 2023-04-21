import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidItemErrorBlueprint = ErrorBlueprint<{
  code: 'commands.parseKeyInput.invalidItem'
  hasPath: false
  payload: {
    received: unknown
    expected?: unknown
  }
}>

type SavedAttributeRequiredErrorBlueprint = ErrorBlueprint<{
  code: 'commands.formatSavedItem.savedAttributeRequired'
  hasPath: true
  payload: undefined
}>

type InvalidSavedAttributeErrorBlueprint = ErrorBlueprint<{
  code: 'commands.formatSavedItem.invalidSavedAttribute'
  hasPath: true
  payload: {
    received: unknown
    expected?: unknown
  }
}>

export type FormatSavedItemErrorBlueprints =
  | InvalidItemErrorBlueprint
  | SavedAttributeRequiredErrorBlueprint
  | InvalidSavedAttributeErrorBlueprint
