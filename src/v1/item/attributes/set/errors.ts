import type { ErrorBlueprint } from 'v1/errors/blueprint'

export type OptionalSetAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'optionalSetAttributeElements'
  hasPath: true
  payload: undefined
}>

export type HiddenSetAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'hiddenSetAttributeElements'
  hasPath: true
  payload: undefined
}>

export type SavedAsSetAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'savedAsSetAttributeElements'
  hasPath: true
  payload: undefined
}>

export type DefaultedSetAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'defaultedSetAttributeElements'
  hasPath: true
  payload: undefined
}>
