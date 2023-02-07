import type {
  InvalidConstantAttributeDefaultValueErrorBlueprint,
  InvalidPrimitiveAttributeEnumValueTypeErrorBlueprint,
  InvalidPrimitiveAttributeDefaultValueTypeErrorBlueprint,
  InvalidPrimitiveAttributeDefaultValueRangeErrorBlueprint,
  OptionalSetAttributeElementsErrorBlueprint,
  HiddenSetAttributeElementsErrorBlueprint,
  SavedAsSetAttributeElementsErrorBlueprint,
  DefaultedSetAttributeElementsErrorBlueprint,
  OptionalListAttributeElementsErrorBlueprint,
  HiddenListAttributeElementsErrorBlueprint,
  SavedAsListAttributeElementsErrorBlueprint,
  DefaultedListAttributeElementsErrorBlueprint,
  DuplicateSavedAsMapAttributesErrorBlueprint,
  DuplicateSavedAsItemAttributesErrorBlueprint
} from 'v1/item/errors'
import type {
  InvalidCapacityOptionErrorBlueprint,
  InvalidConsistentOptionErrorBlueprint,
  InvalidMetricsOptionErrorBlueprint,
  InvalidReturnValuesOptionErrorBlueprint,
  UnknownOptionErrorBlueprint
} from 'v1/commands/errors'

import type { ErrorBlueprint } from './blueprint'

type ErrorBlueprints =
  | InvalidConstantAttributeDefaultValueErrorBlueprint
  | InvalidPrimitiveAttributeEnumValueTypeErrorBlueprint
  | InvalidPrimitiveAttributeDefaultValueTypeErrorBlueprint
  | InvalidPrimitiveAttributeDefaultValueRangeErrorBlueprint
  | OptionalSetAttributeElementsErrorBlueprint
  | HiddenSetAttributeElementsErrorBlueprint
  | SavedAsSetAttributeElementsErrorBlueprint
  | DefaultedSetAttributeElementsErrorBlueprint
  | OptionalListAttributeElementsErrorBlueprint
  | HiddenListAttributeElementsErrorBlueprint
  | SavedAsListAttributeElementsErrorBlueprint
  | DefaultedListAttributeElementsErrorBlueprint
  | DuplicateSavedAsMapAttributesErrorBlueprint
  | DuplicateSavedAsItemAttributesErrorBlueprint
  | InvalidCapacityOptionErrorBlueprint
  | InvalidConsistentOptionErrorBlueprint
  | InvalidMetricsOptionErrorBlueprint
  | InvalidReturnValuesOptionErrorBlueprint
  | UnknownOptionErrorBlueprint

type IndexErrors<ERROR_BLUEPRINTS extends ErrorBlueprint> = {
  [ERROR_BLUEPRINT in ERROR_BLUEPRINTS as ERROR_BLUEPRINT['code']]: ERROR_BLUEPRINT
}

export type IndexedErrors = IndexErrors<ErrorBlueprints>

export type ErrorCodes = keyof IndexedErrors
