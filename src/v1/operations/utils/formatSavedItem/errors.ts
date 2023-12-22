import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidItemErrorBlueprint = ErrorBlueprint<{
  code: 'operations.parseKeyInput.invalidItem'
  hasPath: false
  payload: {
    received: unknown
    expected?: unknown
  }
}>

type SavedAttributeRequiredErrorBlueprint = ErrorBlueprint<{
  code: 'operations.formatSavedItem.savedAttributeRequired'
  hasPath: true
  payload: undefined
}>

type InvalidSavedAttributeErrorBlueprint = ErrorBlueprint<{
  code: 'operations.formatSavedItem.invalidSavedAttribute'
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
