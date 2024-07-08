import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidKeysErrorBlueprint = ErrorBlueprint<{
  code: 'schema.recordAttribute.invalidKeys'
  hasPath: true
  payload: undefined
}>

type OptionalKeysErrorBlueprint = ErrorBlueprint<{
  code: 'schema.recordAttribute.optionalKeys'
  hasPath: true
  payload: undefined
}>

type HiddenKeysErrorBlueprint = ErrorBlueprint<{
  code: 'schema.recordAttribute.hiddenKeys'
  hasPath: true
  payload: undefined
}>

type KeyKeysErrorBlueprint = ErrorBlueprint<{
  code: 'schema.recordAttribute.keyKeys'
  hasPath: true
  payload: undefined
}>

type SavedAsKeysErrorBlueprint = ErrorBlueprint<{
  code: 'schema.recordAttribute.savedAsKeys'
  hasPath: true
  payload: undefined
}>

type DefaultedKeysErrorBlueprint = ErrorBlueprint<{
  code: 'schema.recordAttribute.defaultedKeys'
  hasPath: true
  payload: undefined
}>

type OptionalElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.recordAttribute.optionalElements'
  hasPath: true
  payload: undefined
}>

type HiddenElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.recordAttribute.hiddenElements'
  hasPath: true
  payload: undefined
}>

type KeyElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.recordAttribute.keyElements'
  hasPath: true
  payload: undefined
}>

type SavedAsElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.recordAttribute.savedAsElements'
  hasPath: true
  payload: undefined
}>

type DefaultedElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.recordAttribute.defaultedElements'
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
