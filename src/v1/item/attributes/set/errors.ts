import type { ErrorBlueprint } from 'v1/errors/blueprint'

type OptionalSetAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'optionalSetAttributeElements'
  hasPath: true
  payload: undefined
}>

type HiddenSetAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'hiddenSetAttributeElements'
  hasPath: true
  payload: undefined
}>

type SavedAsSetAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'savedAsSetAttributeElements'
  hasPath: true
  payload: undefined
}>

type DefaultedSetAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'defaultedSetAttributeElements'
  hasPath: true
  payload: undefined
}>

export type SetAttributeErrorBlueprints =
  | OptionalSetAttributeElementsErrorBlueprint
  | HiddenSetAttributeElementsErrorBlueprint
  | SavedAsSetAttributeElementsErrorBlueprint
  | DefaultedSetAttributeElementsErrorBlueprint
