import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.anyOf.invalidElements'
  hasPath: true
  payload: undefined
}>

type MissingElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.anyOf.missingElements'
  hasPath: true
  payload: undefined
}>

type OptionalElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.anyOf.optionalElements'
  hasPath: true
  payload: undefined
}>

type HiddenElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.anyOf.hiddenElements'
  hasPath: true
  payload: undefined
}>

type SavedAsElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.anyOf.savedAsElements'
  hasPath: true
  payload: undefined
}>

type DefaultedElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.anyOf.defaultedElements'
  hasPath: true
  payload: undefined
}>

export type AnyOfSchemaErrorBlueprint =
  | InvalidElementsErrorBlueprint
  | MissingElementsErrorBlueprint
  | OptionalElementsErrorBlueprint
  | HiddenElementsErrorBlueprint
  | SavedAsElementsErrorBlueprint
  | DefaultedElementsErrorBlueprint
