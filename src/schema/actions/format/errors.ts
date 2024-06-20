import type { ErrorBlueprint } from '~/errors/blueprint.js'

type RawAttributeRequiredErrorBlueprint = ErrorBlueprint<{
  code: 'formatter.missingAttribute'
  hasPath: true
  payload: {
    partitionKey?: unknown
    sortKey?: unknown
  }
}>

type InvalidRawAttributeErrorBlueprint = ErrorBlueprint<{
  code: 'formatter.invalidAttribute'
  hasPath: true
  payload: {
    received: unknown
    expected?: unknown
    partitionKey?: unknown
    sortKey?: unknown
  }
}>

type InvalidRawItemErrorBlueprint = ErrorBlueprint<{
  code: 'formatter.invalidItem'
  hasPath: false
  payload: {
    received: unknown
    expected?: unknown
    partitionKey?: unknown
    sortKey?: unknown
  }
}>

export type FormatterErrorBlueprints =
  | RawAttributeRequiredErrorBlueprint
  | InvalidRawAttributeErrorBlueprint
  | InvalidRawItemErrorBlueprint
