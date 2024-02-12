import type { ErrorBlueprint } from 'v1/errors/blueprint'

type SavedAttributeRequiredErrorBlueprint = ErrorBlueprint<{
  code: 'formatter.missingAttribute'
  hasPath: true
  payload: {
    partitionKey?: unknown
    sortKey?: unknown
  }
}>

type InvalidSavedAttributeErrorBlueprint = ErrorBlueprint<{
  code: 'formatter.invalidAttribute'
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
