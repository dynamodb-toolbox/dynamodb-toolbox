import type { ErrorBlueprint } from 'v1/errors/blueprint'

type OptionalListAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'optionalListAttributeElements'
  hasPath: true
  payload: undefined
}>

type HiddenListAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'hiddenListAttributeElements'
  hasPath: true
  payload: undefined
}>

type SavedAsListAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'savedAsListAttributeElements'
  hasPath: true
  payload: undefined
}>

type DefaultedListAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'defaultedListAttributeElements'
  hasPath: true
  payload: undefined
}>

export type ListAttributeErrorBlueprints =
  | OptionalListAttributeElementsErrorBlueprint
  | HiddenListAttributeElementsErrorBlueprint
  | SavedAsListAttributeElementsErrorBlueprint
  | DefaultedListAttributeElementsErrorBlueprint
