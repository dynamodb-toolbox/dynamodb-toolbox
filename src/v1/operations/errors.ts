import type { ErrorBlueprint } from 'v1/errors/blueprint'

import type { ScanCommandErrorBlueprints } from './scan/errors'
import type { QueryCommandErrorBlueprints } from './query/errors'
import type { OperationUtilsErrorBlueprints } from './utils/errors'
import type { ExpressionParsersErrorBlueprints } from './expression/errors'

type IncompleteOperationErrorBlueprint = ErrorBlueprint<{
  code: 'operations.incompleteCommand'
  hasPath: false
  payload: undefined
}>

type InvalidCapacityOptionErrorBlueprint = ErrorBlueprint<{
  code: 'operations.invalidCapacityOption'
  hasPath: false
  payload: { capacity: unknown }
}>

type InvalidClientRequestTokenOptionErrorBlueprint = ErrorBlueprint<{
  code: 'operations.invalidClientRequestTokenOption'
  hasPath: false
  payload: { clientRequestToken: unknown }
}>

type InvalidConsistentOptionErrorBlueprint = ErrorBlueprint<{
  code: 'operations.invalidConsistentOption'
  hasPath: false
  payload: { consistent: unknown }
}>

type InvalidIndexOptionErrorBlueprint = ErrorBlueprint<{
  code: 'operations.invalidIndexOption'
  hasPath: false
  payload: { index: unknown }
}>

type InvalidLimitOptionErrorBlueprint = ErrorBlueprint<{
  code: 'operations.invalidLimitOption'
  hasPath: false
  payload: { limit: unknown }
}>

type InvalidMaxPagesOptionErrorBlueprint = ErrorBlueprint<{
  code: 'operations.invalidMaxPagesOption'
  hasPath: false
  payload: { maxPages: unknown }
}>

type InvalidMetricsOptionErrorBlueprint = ErrorBlueprint<{
  code: 'operations.invalidMetricsOption'
  hasPath: false
  payload: { metrics: unknown }
}>

type InvalidReturnValuesOptionErrorBlueprint = ErrorBlueprint<{
  code: 'operations.invalidReturnValuesOption'
  hasPath: false
  payload: { returnValues: unknown }
}>

type InvalidSelectOptionErrorBlueprint = ErrorBlueprint<{
  code: 'operations.invalidSelectOption'
  hasPath: false
  payload: { select: unknown }
}>

type UnknownOptionErrorBlueprint = ErrorBlueprint<{
  code: 'operations.unknownOption'
  hasPath: false
  payload: { option: unknown }
}>

export type OperationsErrorBlueprints =
  | ScanCommandErrorBlueprints
  | QueryCommandErrorBlueprints
  | OperationUtilsErrorBlueprints
  | IncompleteOperationErrorBlueprint
  | InvalidCapacityOptionErrorBlueprint
  | InvalidClientRequestTokenOptionErrorBlueprint
  | InvalidConsistentOptionErrorBlueprint
  | InvalidIndexOptionErrorBlueprint
  | InvalidLimitOptionErrorBlueprint
  | InvalidMaxPagesOptionErrorBlueprint
  | InvalidMetricsOptionErrorBlueprint
  | InvalidReturnValuesOptionErrorBlueprint
  | InvalidSelectOptionErrorBlueprint
  | UnknownOptionErrorBlueprint
  | ExpressionParsersErrorBlueprints
