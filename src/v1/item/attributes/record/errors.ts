import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidRecordAttributeKeysErrorBlueprint = ErrorBlueprint<{
  code: 'invalidRecordAttributeKeys'
  hasPath: true
  payload: undefined
}>

type OptionalRecordAttributeKeysErrorBlueprint = ErrorBlueprint<{
  code: 'optionalRecordAttributeKeys'
  hasPath: true
  payload: undefined
}>

type HiddenRecordAttributeKeysErrorBlueprint = ErrorBlueprint<{
  code: 'hiddenRecordAttributeKeys'
  hasPath: true
  payload: undefined
}>

type KeyRecordAttributeKeysErrorBlueprint = ErrorBlueprint<{
  code: 'keyRecordAttributeKeys'
  hasPath: true
  payload: undefined
}>

type SavedAsRecordAttributeKeysErrorBlueprint = ErrorBlueprint<{
  code: 'savedAsRecordAttributeKeys'
  hasPath: true
  payload: undefined
}>

type DefaultedRecordAttributeKeysErrorBlueprint = ErrorBlueprint<{
  code: 'defaultedRecordAttributeKeys'
  hasPath: true
  payload: undefined
}>

type OptionalRecordAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'optionalRecordAttributeElements'
  hasPath: true
  payload: undefined
}>

type HiddenRecordAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'hiddenRecordAttributeElements'
  hasPath: true
  payload: undefined
}>

type KeyRecordAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'keyRecordAttributeElements'
  hasPath: true
  payload: undefined
}>

type SavedAsRecordAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'savedAsRecordAttributeElements'
  hasPath: true
  payload: undefined
}>

type DefaultedRecordAttributeElementsErrorBlueprint = ErrorBlueprint<{
  code: 'defaultedRecordAttributeElements'
  hasPath: true
  payload: undefined
}>

export type RecordAttributeErrorBlueprints =
  | InvalidRecordAttributeKeysErrorBlueprint
  | OptionalRecordAttributeKeysErrorBlueprint
  | HiddenRecordAttributeKeysErrorBlueprint
  | KeyRecordAttributeKeysErrorBlueprint
  | SavedAsRecordAttributeKeysErrorBlueprint
  | DefaultedRecordAttributeKeysErrorBlueprint
  | OptionalRecordAttributeElementsErrorBlueprint
  | HiddenRecordAttributeElementsErrorBlueprint
  | KeyRecordAttributeElementsErrorBlueprint
  | SavedAsRecordAttributeElementsErrorBlueprint
  | DefaultedRecordAttributeElementsErrorBlueprint
