import type { O } from 'ts-toolbelt'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type {
  $type,
  $resolved,
  $required,
  $hidden,
  $key,
  $savedAs,
  $enum,
  $default
} from '../constants/attributeOptions'

import type {
  PrimitiveAttributeType,
  ResolvePrimitiveAttributeType,
  PrimitiveAttributeEnumValues,
  PrimitiveAttributeDefaultValue
} from './types'
import type { FreezeAttributeStateConstraint } from '../shared/freezeAttributeStateConstraint'

interface _PrimitiveAttributeStateConstraint<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType
> {
  [$type]: TYPE
  [$required]: RequiredOption
  [$hidden]: boolean
  [$key]: boolean
  [$savedAs]: string | undefined
  [$enum]: PrimitiveAttributeEnumValues<TYPE>
  [$default]: PrimitiveAttributeDefaultValue<TYPE>
}

/**
 * Primitive attribute interface
 */
export type _PrimitiveAttribute<
  STATE extends _PrimitiveAttributeStateConstraint = _PrimitiveAttributeStateConstraint
> = {
  [$type]: STATE[$type]
  [$resolved]?: STATE[$enum] extends ResolvePrimitiveAttributeType<STATE[$type]>[]
    ? STATE[$enum][number]
    : ResolvePrimitiveAttributeType<STATE[$type]>
  [$required]: STATE[$required]
  [$hidden]: STATE[$hidden]
  [$key]: STATE[$key]
  [$savedAs]: STATE[$savedAs]
  [$enum]: STATE[$enum]
  [$default]: STATE[$default]
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
  ) => _PrimitiveAttribute<O.Update<STATE, $required, NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => _PrimitiveAttribute<O.Update<STATE, $required, 'never'>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _PrimitiveAttribute<O.Update<STATE, $hidden, true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _PrimitiveAttribute<O.Update<STATE, $key, true>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _PrimitiveAttribute<O.Update<STATE, $savedAs, NEXT_SAVED_AS>>
  /**
   * Provide a finite list of possible values for attribute
   * (For typing reasons, enums are only available as attribute methods, not as input options)
   *
   * @param {Object[]} enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum: <NEXT_ENUM extends ResolvePrimitiveAttributeType<STATE[$type]>[]>(
    ...nextEnum: NEXT_ENUM
  ) => _PrimitiveAttribute<O.Update<STATE, $enum, NEXT_ENUM>>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <
    NEXT_DEFAULT extends PrimitiveAttributeDefaultValue<STATE[$type]> &
      (STATE[$enum] extends ResolvePrimitiveAttributeType<STATE[$type]>[]
        ? STATE[$enum][number] | (() => STATE[$enum][number])
        : unknown)
  >(
    nextDefaultValue: NEXT_DEFAULT
  ) => _PrimitiveAttribute<O.Update<STATE, $default, NEXT_DEFAULT>>
}

export type PrimitiveAttributeStateConstraint<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType
> = FreezeAttributeStateConstraint<_PrimitiveAttributeStateConstraint<TYPE>>

export type PrimitiveAttribute<
  STATE extends PrimitiveAttributeStateConstraint = PrimitiveAttributeStateConstraint
> = STATE & {
  path: string
  resolved?: STATE['enum'] extends ResolvePrimitiveAttributeType<STATE['type']>[]
    ? STATE['enum'][number]
    : ResolvePrimitiveAttributeType<STATE['type']>
}
