import type { ErrorBlueprint } from '~/errors/blueprint.js'

type OptionalElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.listAttribute.optionalElements'
  hasPath: true
  payload: undefined
}>

type HiddenElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.listAttribute.hiddenElements'
  hasPath: true
  payload: undefined
}>

type SavedAsElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.listAttribute.savedAsElements'
  hasPath: true
  payload: undefined
}>

type DefaultedElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.listAttribute.defaultedElements'
  hasPath: true
  payload: undefined
}>

export type ListAttributeErrorBlueprints =
  | OptionalElementsErrorBlueprint
  | HiddenElementsErrorBlueprint
  | SavedAsElementsErrorBlueprint
  | DefaultedElementsErrorBlueprint
