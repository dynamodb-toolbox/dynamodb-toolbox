import type { ErrorBlueprint } from 'v1/errors/blueprint'

type SavedAttributeRequiredErrorBlueprint = ErrorBlueprint<{
  code: 'operations.formatSavedItem.savedAttributeRequired'
  hasPath: true
  payload: {
    partitionKey?: unknown
    sortKey?: unknown
  }
}>

type InvalidSavedAttributeErrorBlueprint = ErrorBlueprint<{
  code: 'operations.formatSavedItem.invalidSavedAttribute'
  hasPath: true
  payload: {
    received: unknown
    expected?: unknown
    partitionKey?: unknown
    sortKey?: unknown
  }
}>

export type FormatterErrorBlueprints =
  | SavedAttributeRequiredErrorBlueprint
  | InvalidSavedAttributeErrorBlueprint
