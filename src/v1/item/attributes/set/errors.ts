import type { ErrorBlueprint } from 'v1/errors/blueprint'

type OptionalElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.setAttribute.optionalElements'
  hasPath: true
  payload: undefined
}>

type HiddenElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.setAttribute.hiddenElements'
  hasPath: true
  payload: undefined
}>

type SavedAsElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.setAttribute.savedAsElements'
  hasPath: true
  payload: undefined
}>

type DefaultedElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.setAttribute.defaultedElements'
  hasPath: true
  payload: undefined
}>

export type SetAttributeErrorBlueprints =
  | OptionalElementsErrorBlueprint
  | HiddenElementsErrorBlueprint
  | SavedAsElementsErrorBlueprint
  | DefaultedElementsErrorBlueprint
