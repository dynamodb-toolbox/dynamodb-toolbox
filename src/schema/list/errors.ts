import type { ErrorBlueprint } from '~/errors/blueprint.js'

type OptionalElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.list.optionalElements'
  hasPath: true
  payload: undefined
}>

type HiddenElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.list.hiddenElements'
  hasPath: true
  payload: undefined
}>

type SavedAsElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.list.savedAsElements'
  hasPath: true
  payload: undefined
}>

type DefaultedElementsErrorBlueprint = ErrorBlueprint<{
  code: 'schema.list.defaultedElements'
  hasPath: true
  payload: undefined
}>

/**
 * Union of the error blueprints raised when validating a list schema.
 */
export type ListSchemaErrorBlueprint =
  | OptionalElementsErrorBlueprint
  | HiddenElementsErrorBlueprint
  | SavedAsElementsErrorBlueprint
  | DefaultedElementsErrorBlueprint
