import type { ErrorBlueprint } from 'v1/errors/blueprint'

type OptionalElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.listAttribute.optionalElements'
  hasPath: true
  payload: undefined
}>

type HiddenElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.listAttribute.hiddenElements'
  hasPath: true
  payload: undefined
}>

type SavedAsElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.listAttribute.savedAsElements'
  hasPath: true
  payload: undefined
}>

type DefaultedElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.listAttribute.defaultedElements'
  hasPath: true
  payload: undefined
}>

export type ListAttributeErrorBlueprints =
  | OptionalElementsErrorBlueprint
  | HiddenElementsErrorBlueprint
  | SavedAsElementsErrorBlueprint
  | DefaultedElementsErrorBlueprint
