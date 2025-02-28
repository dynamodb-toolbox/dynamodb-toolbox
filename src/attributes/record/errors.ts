import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidKeysErrorBlueprint = ErrorBlueprint<{
  code: 'schema.record.invalidKeys'
  hasPath: true
  payload: undefined
}>

type OptionalKeysErrorBlueprint = ErrorBlueprint<{
  code: 'schema.record.optionalKeys'
  hasPath: true
  payload: undefined
}>

type HiddenKeysErrorBlueprint = ErrorBlueprint<{
  code: 'schema.record.hiddenKeys'
  hasPath: true
  payload: undefined
}>

type KeyKeysErrorBlueprint = ErrorBlueprint<{
  code: 'schema.record.keyKeys'
  hasPath: true
  payload: undefined
}>

type SavedAsKeysErrorBlueprint = ErrorBlueprint<{
  code: 'schema.record.savedAsKeys'
  hasPath: true
  payload: undefined
}>

type DefaultedKeysErrorBlueprint = ErrorBlueprint<{
  code: 'schema.record.defaultedKeys'
  hasPath: true
  payload: undefined
}>

type OptionalElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.record.optionalElements'
  hasPath: true
  payload: undefined
}>

type HiddenElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.record.hiddenElements'
  hasPath: true
  payload: undefined
}>

type KeyElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.record.keyElements'
  hasPath: true
  payload: undefined
}>

type SavedAsElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.record.savedAsElements'
  hasPath: true
  payload: undefined
}>

type DefaultedElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.record.defaultedElements'
  hasPath: true
  payload: undefined
}>

export type RecordSchemaErrorBlueprint =
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
