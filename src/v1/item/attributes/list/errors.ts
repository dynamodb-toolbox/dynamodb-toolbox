import type { ErrorBlueprint } from 'v1/errors/blueprint'

export type OptionalListAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'optionalListAttributeElements'
  hasPath: true
  payload: undefined
}>

export type HiddenListAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'hiddenListAttributeElements'
  hasPath: true
  payload: undefined
}>

export type SavedAsListAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'savedAsListAttributeElements'
  hasPath: true
  payload: undefined
}>

export type DefaultedListAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'defaultedListAttributeElements'
  hasPath: true
  payload: undefined
}>
