import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidAnyOfAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'invalidAnyOfAttributeElements'
  hasPath: true
  payload: undefined
}>
type MissingAnyOfAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'missingAnyOfAttributeElements'
  hasPath: true
  payload: undefined
}>

type OptionalAnyOfAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'optionalAnyOfAttributeElements'
  hasPath: true
  payload: undefined
}>

type HiddenAnyOfAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'hiddenAnyOfAttributeElements'
  hasPath: true
  payload: undefined
}>

type SavedAsAnyOfAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'savedAsAnyOfAttributeElements'
  hasPath: true
  payload: undefined
}>

type DefaultedAnyOfAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'defaultedAnyOfAttributeElements'
  hasPath: true
  payload: undefined
}>

export type AnyOfAttributeErrorBlueprints =
  | InvalidAnyOfAttributeElementsErrorBlueprint
  | MissingAnyOfAttributeElementsErrorBlueprint
  | OptionalAnyOfAttributeElementsErrorBlueprint
  | HiddenAnyOfAttributeElementsErrorBlueprint
  | SavedAsAnyOfAttributeElementsErrorBlueprint
  | DefaultedAnyOfAttributeElementsErrorBlueprint
