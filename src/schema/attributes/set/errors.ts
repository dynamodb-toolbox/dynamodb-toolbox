import type { ErrorBlueprint } from '~/errors/blueprint.js'

type OptionalElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.setAttribute.optionalElements'
  hasPath: true
  payload: undefined
}>

type HiddenElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.setAttribute.hiddenElements'
  hasPath: true
  payload: undefined
}>

type SavedAsElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.setAttribute.savedAsElements'
  hasPath: true
  payload: undefined
}>

type DefaultedElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.setAttribute.defaultedElements'
  hasPath: true
  payload: undefined
}>

export type SetAttributeErrorBlueprints =
  | OptionalElementsErrorBlueprint
  | HiddenElementsErrorBlueprint
  | SavedAsElementsErrorBlueprint
  | DefaultedElementsErrorBlueprint
