import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidKeysErrorBlueprint = ErrorBlueprint<{
  code: 'item.recordAttribute.invalidKeys'
  hasPath: true
  payload: undefined
}>

type OptionalKeysErrorBlueprint = ErrorBlueprint<{
  code: 'item.recordAttribute.optionalKeys'
  hasPath: true
  payload: undefined
}>

type HiddenKeysErrorBlueprint = ErrorBlueprint<{
  code: 'item.recordAttribute.hiddenKeys'
  hasPath: true
  payload: undefined
}>

type KeyKeysErrorBlueprint = ErrorBlueprint<{
  code: 'item.recordAttribute.keyKeys'
  hasPath: true
  payload: undefined
}>

type SavedAsKeysErrorBlueprint = ErrorBlueprint<{
  code: 'item.recordAttribute.savedAsKeys'
  hasPath: true
  payload: undefined
}>

type DefaultedKeysErrorBlueprint = ErrorBlueprint<{
  code: 'item.recordAttribute.defaultedKeys'
  hasPath: true
  payload: undefined
}>

type OptionalElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.recordAttribute.optionalElements'
  hasPath: true
  payload: undefined
}>

type HiddenElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.recordAttribute.hiddenElements'
  hasPath: true
  payload: undefined
}>

type KeyElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.recordAttribute.keyElements'
  hasPath: true
  payload: undefined
}>

type SavedAsElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.recordAttribute.savedAsElements'
  hasPath: true
  payload: undefined
}>

type DefaultedElementsErrorBlueprint = ErrorBlueprint<{
  code: 'item.recordAttribute.defaultedElements'
  hasPath: true
  payload: undefined
}>

export type RecordAttributeErrorBlueprints =
  | InvalidKeysErrorBlueprint
  | OptionalKeysErrorBlueprint
  | HiddenKeysErrorBlueprint
  | KeyKeysErrorBlueprint
  | SavedAsKeysErrorBlueprint
  | DefaultedKeysErrorBlueprint
  | OptionalElementsErrorBlueprint
  | HiddenElementsErrorBlueprint
  | KeyElementsErrorBlueprint
  | SavedAsElementsErrorBlueprint
  | DefaultedElementsErrorBlueprint
