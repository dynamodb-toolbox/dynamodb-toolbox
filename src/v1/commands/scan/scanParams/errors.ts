import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidCapacityOptionErrorBlueprint = ErrorBlueprint<{
  code: 'scanCommand.invalidSelectOption'
  hasPath: false
  payload: { select: unknown }
}>

type InvalidSegmentOptionErrorBlueprint = ErrorBlueprint<{
  code: 'scanCommand.invalidSegmentOption'
  hasPath: false
  payload: { segment?: unknown; totalSegments?: unknown }
}>

export type ScanCommandErrorBlueprints =
  | InvalidCapacityOptionErrorBlueprint
  | InvalidSegmentOptionErrorBlueprint
