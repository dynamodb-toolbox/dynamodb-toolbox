import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.anyOfAttribute.invalidElements'
  hasPath: true
  payload: undefined
}>

type MissingElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.anyOfAttribute.missingElements'
  hasPath: true
  payload: undefined
}>

type OptionalElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.anyOfAttribute.optionalElements'
  hasPath: true
  payload: undefined
}>

type HiddenElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.anyOfAttribute.hiddenElements'
  hasPath: true
  payload: undefined
}>

type SavedAsElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.anyOfAttribute.savedAsElements'
  hasPath: true
  payload: undefined
}>

type DefaultedElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.anyOfAttribute.defaultedElements'
  hasPath: true
  payload: undefined
}>

export type AnyOfAttributeErrorBlueprints =
  | InvalidElementsErrorBlueprint
  | MissingElementsErrorBlueprint
  | OptionalElementsErrorBlueprint
  | HiddenElementsErrorBlueprint
  | SavedAsElementsErrorBlueprint
  | DefaultedElementsErrorBlueprint
