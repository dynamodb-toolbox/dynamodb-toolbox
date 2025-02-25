/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { AttributeUpdateItemInput, UpdateItemInput } from '~/entity/actions/update/types.js'
import type { Schema, SchemaAction, ValidValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/index.js'
import type {
  ConstrainedOverwrite,
  If,
  NarrowObject,
  Overwrite,
  ValueOrGetter,
  Writable
} from '~/types/index.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'
import { writable } from '~/utils/writable.js'

import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/requiredOptions.js'
import type { Validator } from '../types/validator.js'
import type { FreezeBinaryAttribute } from './freeze.js'
import { freezeBinaryAttribute } from './freeze.js'
import type { ResolveBinaryAttribute, ResolvedBinaryAttribute } from './resolve.js'
import type { BinaryAttributeState } from './types.js'

export interface $BinaryAttributeState<STATE extends BinaryAttributeState = BinaryAttributeState> {
  type: 'binary'
  state: STATE
}

export interface $BinaryAttributeNestedState<
  STATE extends BinaryAttributeState = BinaryAttributeState
> extends $BinaryAttributeState<STATE> {
  freeze: (path?: string) => FreezeBinaryAttribute<$BinaryAttributeState<STATE>, true>
}

/**
 * Number attribute (warm)
 */
export class $BinaryAttribute<STATE extends BinaryAttributeState = BinaryAttributeState>
  implements $BinaryAttributeNestedState<STATE>
{
  type: 'binary'
  state: STATE

  constructor(state: STATE) {
    this.type = 'binary'
    this.state = state
  }

  /**
   * Tag attribute as required. Possible values are:
   * - `'atLeastOnce'` _(default)_: Required in PUTs, optional in UPDATEs
   * - `'never'`: Optional in PUTs and UPDATEs
   * - `'always'`: Required in PUTs and UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required<NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
  ): $BinaryAttribute<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>> {
    return new $BinaryAttribute(overwrite(this.state, { required: nextRequired }))
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $BinaryAttribute<Overwrite<STATE, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $BinaryAttribute<Overwrite<STATE, { hidden: NEXT_HIDDEN }>> {
    return new $BinaryAttribute(overwrite(this.state, { hidden: nextHidden }))
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $BinaryAttribute<Overwrite<STATE, { key: NEXT_KEY; required: Always }>> {
    return new $BinaryAttribute(overwrite(this.state, { key: nextKey, required: 'always' }))
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $BinaryAttribute<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>> {
    return new $BinaryAttribute(overwrite(this.state, { savedAs: nextSavedAs }))
  }

  /**
   * Provide a finite list of possible values for attribute
   * (For typing reasons, enums are only available as attribute methods, not as input options)
   *
   * @param enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum<
    const NEXT_ENUM extends readonly ResolveBinaryAttribute<
      FreezeBinaryAttribute<$BinaryAttributeState<STATE>>
    >[]
  >(...nextEnum: NEXT_ENUM): $BinaryAttribute<Overwrite<STATE, { enum: Writable<NEXT_ENUM> }>> {
    return new $BinaryAttribute(overwrite(this.state, { enum: writable(nextEnum) }))
  }

  /**
   * Shorthand for `enum(constantValue).default(constantValue)`
   *
   * @param constantValue Constant value
   * @example
   * string().const('foo')
   */
  const<
    CONSTANT extends ResolveBinaryAttribute<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>>
  >(
    constant: CONSTANT
  ): If<
    STATE['key'],
    $BinaryAttribute<Overwrite<STATE, { enum: [CONSTANT]; keyDefault: unknown }>>,
    $BinaryAttribute<Overwrite<STATE, { enum: [CONSTANT]; putDefault: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $BinaryAttribute(
        overwrite(this.state, { enum: [constant] as [CONSTANT], keyDefault: constant as unknown })
      ),
      new $BinaryAttribute(
        overwrite(this.state, { enum: [constant] as [CONSTANT], putDefault: constant as unknown })
      )
    )
  }

  /**
   * Transform the attribute value in PUT commands OR Primary Key computing if attribute is tagged as key
   */
  transform<
    TRANSFORMER extends Transformer<
      ResolvedBinaryAttribute,
      ResolveBinaryAttribute<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>>
    >
  >(transform: TRANSFORMER): $BinaryAttribute<Overwrite<STATE, { transform: TRANSFORMER }>> {
    return new $BinaryAttribute(overwrite(this.state, { transform }))
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ValidValue<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>, { mode: 'key' }>
    >
  ): $BinaryAttribute<Overwrite<STATE, { keyDefault: unknown }>> {
    return new $BinaryAttribute(overwrite(this.state, { keyDefault: nextKeyDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>>>
  ): $BinaryAttribute<Overwrite<STATE, { putDefault: unknown }>> {
    return new $BinaryAttribute(overwrite(this.state, { putDefault: nextPutDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<
      AttributeUpdateItemInput<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>, true>
    >
  ): $BinaryAttribute<Overwrite<STATE, { updateDefault: unknown }>> {
    return new $BinaryAttribute(
      overwrite(this.state, { updateDefault: nextUpdateDefault as unknown })
    )
  }

  /**
   * Provide a default value for attribute in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextDefault `key/putAttributeInput | (() => key/putAttributeInput)`
   */
  default(
    nextDefault: ValueOrGetter<
      If<
        STATE['key'],
        ValidValue<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>, { mode: 'key' }>,
        ValidValue<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>>
      >
    >
  ): If<
    STATE['key'],
    $BinaryAttribute<Overwrite<STATE, { keyDefault: unknown }>>,
    $BinaryAttribute<Overwrite<STATE, { putDefault: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $BinaryAttribute(overwrite(this.state, { keyDefault: nextDefault as unknown })),
      new $BinaryAttribute(overwrite(this.state, { putDefault: nextDefault as unknown }))
    )
  }

  /**
   * Provide a **linked** default value for attribute in Primary Key computing
   *
   * @param nextKeyLink `keyAttributeInput | ((keyInput) => keyAttributeInput)`
   */
  keyLink<SCHEMA extends Schema>(
    nextKeyLink: (
      keyInput: ValidValue<SCHEMA, { mode: 'key' }>
    ) => ValidValue<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>, { mode: 'key' }>
  ): $BinaryAttribute<Overwrite<STATE, { keyLink: unknown }>> {
    return new $BinaryAttribute(overwrite(this.state, { keyLink: nextKeyLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (
      putItemInput: ValidValue<SCHEMA>
    ) => ValidValue<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>>
  ): $BinaryAttribute<Overwrite<STATE, { putLink: unknown }>> {
    return new $BinaryAttribute(overwrite(this.state, { putLink: nextPutLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in UPDATE commands
   *
   * @param nextUpdateLink `unknown | ((updateItemInput) => updateAttributeInput)`
   */
  updateLink<SCHEMA extends Schema>(
    nextUpdateLink: (
      updateItemInput: UpdateItemInput<SCHEMA, true>
    ) => AttributeUpdateItemInput<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>, true>
  ): $BinaryAttribute<Overwrite<STATE, { updateLink: unknown }>> {
    return new $BinaryAttribute(overwrite(this.state, { updateLink: nextUpdateLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextLink `key/putAttributeInput | (() => key/putAttributeInput)`
   */
  link<SCHEMA extends Schema>(
    nextLink: (
      keyOrPutItemInput: If<STATE['key'], ValidValue<SCHEMA, { mode: 'key' }>, ValidValue<SCHEMA>>
    ) => If<
      STATE['key'],
      ValidValue<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>, { mode: 'key' }>,
      ValidValue<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>>
    >
  ): If<
    STATE['key'],
    $BinaryAttribute<Overwrite<STATE, { keyLink: unknown }>>,
    $BinaryAttribute<Overwrite<STATE, { putLink: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $BinaryAttribute(overwrite(this.state, { keyLink: nextLink as unknown })),
      new $BinaryAttribute(overwrite(this.state, { putLink: nextLink as unknown }))
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<
      ValidValue<
        FreezeBinaryAttribute<$BinaryAttributeState<STATE>>,
        { mode: 'key'; defined: true }
      >,
      FreezeBinaryAttribute<$BinaryAttributeState<STATE>>
    >
  ): $BinaryAttribute<Overwrite<STATE, { keyValidator: Validator }>> {
    return new $BinaryAttribute(
      overwrite(this.state, { keyValidator: nextKeyValidator as Validator })
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => boolean | string`
   */
  putValidate(
    nextPutValidator: Validator<
      ValidValue<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>, { defined: true }>,
      FreezeBinaryAttribute<$BinaryAttributeState<STATE>>
    >
  ): $BinaryAttribute<Overwrite<STATE, { putValidator: Validator }>> {
    return new $BinaryAttribute(
      overwrite(this.state, { putValidator: nextPutValidator as Validator })
    )
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => boolean | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<
      AttributeUpdateItemInput<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>, true>,
      FreezeBinaryAttribute<$BinaryAttributeState<STATE>>
    >
  ): $BinaryAttribute<Overwrite<STATE, { updateValidator: Validator }>> {
    return new $BinaryAttribute(
      overwrite(this.state, { updateValidator: nextUpdateValidator as Validator })
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextValidator `(key/putAttributeInput) => boolean | string`
   */
  validate(
    nextValidator: Validator<
      If<
        STATE['key'],
        ValidValue<
          FreezeBinaryAttribute<$BinaryAttributeState<STATE>>,
          { mode: 'key'; defined: true }
        >,
        ValidValue<FreezeBinaryAttribute<$BinaryAttributeState<STATE>>, { defined: true }>
      >,
      FreezeBinaryAttribute<$BinaryAttributeState<STATE>>
    >
  ): If<
    STATE['key'],
    $BinaryAttribute<Overwrite<STATE, { keyValidator: Validator }>>,
    $BinaryAttribute<Overwrite<STATE, { putValidator: Validator }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $BinaryAttribute(overwrite(this.state, { keyValidator: nextValidator as Validator })),
      new $BinaryAttribute(overwrite(this.state, { putValidator: nextValidator as Validator }))
    )
  }

  freeze(path?: string): FreezeBinaryAttribute<$BinaryAttributeState<STATE>, true> {
    return freezeBinaryAttribute(this.state, path)
  }
}

export class BinaryAttribute<STATE extends BinaryAttributeState = BinaryAttributeState> {
  type: 'binary'
  path?: string
  state: STATE

  constructor({ path, ...state }: STATE & { path?: string }) {
    this.type = 'binary'
    this.path = path
    this.state = state as STATE
  }
}

export class BinaryAttribute_<
  STATE extends BinaryAttributeState = BinaryAttributeState
> extends BinaryAttribute<STATE> {
  clone<NEXT_STATE extends Partial<BinaryAttributeState> = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): BinaryAttribute_<ConstrainedOverwrite<BinaryAttributeState, STATE, NEXT_STATE>> {
    return new BinaryAttribute_({
      ...(this.path !== undefined ? { path: this.path } : {}),
      ...this.state,
      ...nextState
    } as ConstrainedOverwrite<BinaryAttributeState, STATE, NEXT_STATE>)
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
