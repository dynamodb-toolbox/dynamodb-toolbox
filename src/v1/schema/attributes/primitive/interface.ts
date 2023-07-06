import type { O } from 'ts-toolbelt'

import type { RequiredOption, AtLeastOnce, Never, Always } from '../constants/requiredOptions'
import type { $type, $enum, $defaults } from '../constants/attributeOptions'
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
  defaults: {
    key: PrimitiveAttributeDefaultValue<TYPE>
    put: PrimitiveAttributeDefaultValue<TYPE>
    update: PrimitiveAttributeDefaultValue<TYPE>
  }
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
  [$defaults]: STATE['defaults']
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired?: NEXT_IS_REQUIRED
  ) => $PrimitiveAttribute<$TYPE, O.Update<STATE, 'required', NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $PrimitiveAttribute<$TYPE, O.Update<STATE, 'required', Never>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => $PrimitiveAttribute<$TYPE, O.Update<STATE, 'hidden', true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $PrimitiveAttribute<$TYPE, O.Update<O.Update<STATE, 'key', true>, 'required', Always>>
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
   * @param enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum: <NEXT_ENUM extends ResolvePrimitiveAttributeType<$TYPE>[]>(
    ...nextEnum: NEXT_ENUM
  ) => $PrimitiveAttribute<$TYPE, O.Update<STATE, 'enum', NEXT_ENUM>>
  /**
   * Shorthand for `enum(constantValue).default(constantValue)`
   *
   * @param constantValue Constant value
   * @example
   * string().const('foo')
   */
  const: <CONSTANT extends ResolvePrimitiveAttributeType<$TYPE>>(
    constant: CONSTANT
  ) => $PrimitiveAttribute<
    $TYPE,
    O.Update<
      O.Update<STATE, 'enum', [CONSTANT]>,
      'defaults',
      O.Update<STATE['defaults'], STATE['key'] extends true ? 'key' : 'put', CONSTANT>
    >
  >
  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  keyDefault: <
    NEXT_KEY_DEFAULT extends PrimitiveAttributeDefaultValue<$TYPE> &
      (STATE['enum'] extends ResolvePrimitiveAttributeType<$TYPE>[]
        ? STATE['enum'][number] | (() => STATE['enum'][number])
        : unknown)
  >(
    nextKeyDefault: NEXT_KEY_DEFAULT
  ) => $PrimitiveAttribute<
    $TYPE,
    O.Update<STATE, 'defaults', O.Update<STATE['defaults'], 'key', NEXT_KEY_DEFAULT>>
  >
  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  putDefault: <
    NEXT_PUT_DEFAULT extends PrimitiveAttributeDefaultValue<$TYPE> &
      (STATE['enum'] extends ResolvePrimitiveAttributeType<$TYPE>[]
        ? STATE['enum'][number] | (() => STATE['enum'][number])
        : unknown)
  >(
    nextPutDefault: NEXT_PUT_DEFAULT
  ) => $PrimitiveAttribute<
    $TYPE,
    O.Update<STATE, 'defaults', O.Update<STATE['defaults'], 'put', NEXT_PUT_DEFAULT>>
  >
  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  updateDefault: <
    NEXT_UPDATE_DEFAULT extends PrimitiveAttributeDefaultValue<$TYPE> &
      (STATE['enum'] extends ResolvePrimitiveAttributeType<$TYPE>[]
        ? STATE['enum'][number] | (() => STATE['enum'][number])
        : unknown)
  >(
    nextUpdateDefault: NEXT_UPDATE_DEFAULT
  ) => $PrimitiveAttribute<
    $TYPE,
    O.Update<STATE, 'defaults', O.Update<STATE['defaults'], 'update', NEXT_UPDATE_DEFAULT>>
  >
  /**
   * Provide a default value for attribute in PUT commands / Primary Key computing if attribute is tagged as key
   *
   * @param nextDefault `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <
    NEXT_DEFAULT extends PrimitiveAttributeDefaultValue<$TYPE> &
      (STATE['enum'] extends ResolvePrimitiveAttributeType<$TYPE>[]
        ? STATE['enum'][number] | (() => STATE['enum'][number])
        : unknown)
  >(
    nextDefault: NEXT_DEFAULT
  ) => $PrimitiveAttribute<
    $TYPE,
    O.Update<
      STATE,
      'defaults',
      O.Update<STATE['defaults'], STATE['key'] extends true ? 'key' : 'put', NEXT_DEFAULT>
    >
  >
}

export interface PrimitiveAttribute<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType,
  STATE extends PrimitiveAttributeStateConstraint<TYPE> = PrimitiveAttributeStateConstraint<TYPE>
> extends AttributeSharedState<STATE> {
  path: string
  type: TYPE
  enum: STATE['enum']
  defaults: STATE['defaults']
}
