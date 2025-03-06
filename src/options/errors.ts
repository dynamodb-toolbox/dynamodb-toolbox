import type { ErrorBlueprint } from '~/errors/blueprint.js'

type IncompleteActionErrorBlueprint = ErrorBlueprint<{
  code: 'actions.incompleteAction'
  hasPath: false
  payload: undefined
}>

type InvalidActionErrorBlueprint = ErrorBlueprint<{
  code: 'actions.invalidAction'
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

type InvalidReturnValuesOnConditionFalseOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidReturnValuesOnConditionFalseOption'
  hasPath: false
  payload: { returnValues: unknown }
}>

type InvalidSelectOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidSelectOption'
  hasPath: false
  payload: { select: unknown }
}>

type InvalidTableNameOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidTableNameOption'
  hasPath: false
  payload: { tableName: unknown }
}>

type InvalidEntityAttrFilterOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidEntityAttrFilterOption'
  hasPath: false
  payload: { entityAttrFilter?: unknown }
}>

type InvalidShowEntityAttrOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidShowEntityAttrOption'
  hasPath: false
  payload: { showEntityAttr: unknown }
}>

type InvalidNoEntityMatchBehaviorOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.invalidNoEntityMatchBehaviorOption'
  hasPath: false
  payload: { noEntityMatchBehavior: unknown }
}>

type UnknownOptionErrorBlueprint = ErrorBlueprint<{
  code: 'options.unknownOption'
  hasPath: false
  payload: { option: unknown }
}>

type MissingDocumentClientErrorBlueprint = ErrorBlueprint<{
  code: 'actions.missingDocumentClient'
  hasPath: false
  payload: undefined
}>

export type OptionsErrorBlueprints =
  | IncompleteActionErrorBlueprint
  | InvalidActionErrorBlueprint
  | InvalidCapacityOptionErrorBlueprint
  | InvalidClientRequestTokenOptionErrorBlueprint
  | InvalidConsistentOptionErrorBlueprint
  | InvalidIndexOptionErrorBlueprint
  | InvalidLimitOptionErrorBlueprint
  | InvalidMaxPagesOptionErrorBlueprint
  | InvalidMetricsOptionErrorBlueprint
  | InvalidReturnValuesOptionErrorBlueprint
  | InvalidReturnValuesOnConditionFalseOptionErrorBlueprint
  | InvalidSelectOptionErrorBlueprint
  | InvalidTableNameOptionErrorBlueprint
  | InvalidEntityAttrFilterOptionErrorBlueprint
  | InvalidShowEntityAttrOptionErrorBlueprint
  | InvalidNoEntityMatchBehaviorOptionErrorBlueprint
  | UnknownOptionErrorBlueprint
  | MissingDocumentClientErrorBlueprint
