import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.anyOfAttribute.invalidElements'
  hasPath: true
  payload: undefined
}>
type MissingElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.anyOfAttribute.missingElements'
  hasPath: true
  payload: undefined
}>

type OptionalElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.anyOfAttribute.optionalElements'
  hasPath: true
  payload: undefined
}>

type HiddenElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.anyOfAttribute.hiddenElements'
  hasPath: true
  payload: undefined
}>

type SavedAsElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.anyOfAttribute.savedAsElements'
  hasPath: true
  payload: undefined
}>

type DefaultedElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.anyOfAttribute.defaultedElements'
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
