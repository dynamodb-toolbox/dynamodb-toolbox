import type { ErrorBlueprint } from '~/errors/blueprint.js'

type IncompleteActionErrorBlueprint = ErrorBlueprint<{
  code: 'actions.incompleteAction'
  hasPath: false
  payload: undefined
}>

type MissingDocumentClientErrorBlueprint = ErrorBlueprint<{
  code: 'actions.missingDocumentClient'
  hasPath: false
  payload: undefined
}>

type InvalidCapacityOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidCapacityOption'
  hasPath: false
  payload: { capacity: unknown }
}>

type InvalidClientRequestTokenOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidClientRequestToken'
  hasPath: false
  payload: { clientRequestToken: unknown }
}>

type InvalidConsistentOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidConsistentOption'
  hasPath: false
  payload: { consistent: unknown }
}>

type InvalidIndexOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidIndexOption'
  hasPath: false
  payload: { index: unknown }
}>

type InvalidLimitOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidLimitOption'
  hasPath: false
  payload: { limit: unknown }
}>

type InvalidMaxPagesOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidMaxPagesOption'
  hasPath: false
  payload: { maxPages: unknown }
}>

type InvalidMetricsOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidMetricsOption'
  hasPath: false
  payload: { metrics: unknown }
}>

type InvalidReturnValuesOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidReturnValuesOption'
  hasPath: false
  payload: { returnValues: unknown }
}>

type InvalidSelectOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidSelectOption'
  hasPath: false
  payload: { select: unknown }
}>

type UnknownOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.unknownOption'
  hasPath: false
  payload: { option: unknown }
}>

export type OptionsErrorBlueprints =
  | IncompleteActionErrorBlueprint
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
  | MissingDocumentClientErrorBlueprint
