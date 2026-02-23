import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.tuple.invalidElements'
  hasPath: true
  payload: undefined
}>

type MissingElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.tuple.missingElements'
  hasPath: true
  payload: undefined
}>

type OptionalElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.tuple.optionalElements'
  hasPath: true
  payload: undefined
}>

type HiddenElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.tuple.hiddenElements'
  hasPath: true
  payload: undefined
}>

type SavedAsElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.tuple.savedAsElements'
  hasPath: true
  payload: undefined
}>

type DefaultedElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.tuple.defaultedElements'
  hasPath: true
  payload: undefined
}>

export type TupleSchemaErrorBlueprint =
  | InvalidElementsErrorBlueprint
  | MissingElementsErrorBlueprint
  | OptionalElementsErrorBlueprint
  | HiddenElementsErrorBlueprint
  | SavedAsElementsErrorBlueprint
  | DefaultedElementsErrorBlueprint
