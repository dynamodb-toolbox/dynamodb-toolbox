import type { O } from 'ts-toolbelt'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type { $type, $enum, $default } from '../constants/attributeOptions'
import type {
  AttributeSharedStateConstraint,
  $AttributeSharedState,
  AttributeSharedState
} from '../shared/interface'

import type {
  PrimitiveAttributeType,
  ResolvePrimitiveAttributeType,
  PrimitiveAttributeEnumValues,
  PrimitiveAttributeDefaultValue
} from './types'

interface PrimitiveAttributeStateConstraint<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType
> extends AttributeSharedStateConstraint {
  enum: PrimitiveAttributeEnumValues<TYPE>
  default: PrimitiveAttributeDefaultValue<TYPE>
}

/**
 * Primitive attribute interface
 */
export interface $PrimitiveAttribute<
  $TYPE extends PrimitiveAttributeType = PrimitiveAttributeType,
  STATE extends PrimitiveAttributeStateConstraint<$TYPE> = PrimitiveAttributeStateConstraint<$TYPE>
> extends $AttributeSharedState<STATE> {
  [$type]: $TYPE
  [$enum]: STATE['enum']
  [$default]: STATE['default']
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired?: NEXT_IS_REQUIRED
  ) => $PrimitiveAttribute<$TYPE, O.Update<STATE, 'required', NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $PrimitiveAttribute<$TYPE, O.Update<STATE, 'required', 'never'>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => $PrimitiveAttribute<$TYPE, O.Update<STATE, 'hidden', true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $PrimitiveAttribute<$TYPE, O.Update<STATE, 'key', true>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $PrimitiveAttribute<$TYPE, O.Update<STATE, 'savedAs', NEXT_SAVED_AS>>
  /**
   * Provide a finite list of possible values for attribute
   * (For typing reasons, enums are only available as attribute methods, not as input options)
   *
   * @param {Object[]} enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum: <NEXT_ENUM extends ResolvePrimitiveAttributeType<$TYPE>[]>(
    ...nextEnum: NEXT_ENUM
  ) => $PrimitiveAttribute<$TYPE, O.Update<STATE, 'enum', NEXT_ENUM>>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <
    NEXT_DEFAULT extends PrimitiveAttributeDefaultValue<$TYPE> &
      (STATE['enum'] extends ResolvePrimitiveAttributeType<$TYPE>[]
        ? STATE['enum'][number] | (() => STATE['enum'][number])
        : unknown)
  >(
    nextDefaultValue: NEXT_DEFAULT
  ) => $PrimitiveAttribute<$TYPE, O.Update<STATE, 'default', NEXT_DEFAULT>>
}

export interface PrimitiveAttribute<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType,
  STATE extends PrimitiveAttributeStateConstraint<TYPE> = PrimitiveAttributeStateConstraint<TYPE>
> extends AttributeSharedState<STATE> {
  path: string
  type: TYPE
  enum: STATE['enum']
  default: STATE['default']
}
