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

import { $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/requiredOptions.js'
import type { Validator } from '../types/validator.js'
import type { FreezeBooleanAttribute } from './freeze.js'
import { freezeBooleanAttribute } from './freeze.js'
import type { ResolveBooleanAttribute, ResolvedBooleanAttribute } from './resolve.js'
import type { BooleanAttributeState } from './types.js'

export interface $BooleanAttributeState<
  STATE extends BooleanAttributeState = BooleanAttributeState
> {
  [$type]: 'boolean'
  state: STATE
}

export interface $BooleanAttributeNestedState<
  STATE extends BooleanAttributeState = BooleanAttributeState
> extends $BooleanAttributeState<STATE> {
  freeze: (path?: string) => FreezeBooleanAttribute<$BooleanAttributeState<STATE>, true>
}

/**
 * Boolean attribute (warm)
 */
export class $BooleanAttribute<STATE extends BooleanAttributeState = BooleanAttributeState>
  implements $BooleanAttributeNestedState<STATE>
{
  [$type]: 'boolean'
  state: STATE

  constructor(state: STATE) {
    this[$type] = 'boolean'
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
  ): $BooleanAttribute<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>> {
    return new $BooleanAttribute(overwrite(this.state, { required: nextRequired }))
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $BooleanAttribute<Overwrite<STATE, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $BooleanAttribute<Overwrite<STATE, { hidden: NEXT_HIDDEN }>> {
    return new $BooleanAttribute(overwrite(this.state, { hidden: nextHidden }))
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $BooleanAttribute<Overwrite<STATE, { key: NEXT_KEY; required: Always }>> {
    return new $BooleanAttribute(overwrite(this.state, { key: nextKey, required: 'always' }))
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $BooleanAttribute<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>> {
    return new $BooleanAttribute(overwrite(this.state, { savedAs: nextSavedAs }))
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
    const NEXT_ENUM extends readonly ResolveBooleanAttribute<
      FreezeBooleanAttribute<$BooleanAttributeState<STATE>>
    >[]
  >(...nextEnum: NEXT_ENUM): $BooleanAttribute<Overwrite<STATE, { enum: Writable<NEXT_ENUM> }>> {
    return new $BooleanAttribute(overwrite(this.state, { enum: writable(nextEnum) }))
  }

  /**
   * Shorthand for `enum(constantValue).default(constantValue)`
   *
   * @param constantValue Constant value
   * @example
   * string().const('foo')
   */
  const<
    CONSTANT extends ResolveBooleanAttribute<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>>
  >(
    constant: CONSTANT
  ): If<
    STATE['key'],
    $BooleanAttribute<Overwrite<STATE, { enum: [CONSTANT]; keyDefault: unknown }>>,
    $BooleanAttribute<Overwrite<STATE, { enum: [CONSTANT]; putDefault: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $BooleanAttribute(
        overwrite(this.state, { enum: [constant] as [CONSTANT], keyDefault: constant as unknown })
      ),
      new $BooleanAttribute(
        overwrite(this.state, { enum: [constant] as [CONSTANT], putDefault: constant as unknown })
      )
    )
  }

  /**
   * Transform the attribute value in PUT commands OR Primary Key computing if attribute is tagged as key
   */
  transform<
    TRANSFORMER extends Transformer<
      ResolvedBooleanAttribute,
      ResolveBooleanAttribute<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>>
    >
  >(transform: TRANSFORMER): $BooleanAttribute<Overwrite<STATE, { transform: TRANSFORMER }>> {
    return new $BooleanAttribute(overwrite(this.state, { transform }))
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ValidValue<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>, { mode: 'key' }>
    >
  ): $BooleanAttribute<Overwrite<STATE, { keyDefault: unknown }>> {
    return new $BooleanAttribute(overwrite(this.state, { keyDefault: nextKeyDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>>>
  ): $BooleanAttribute<Overwrite<STATE, { putDefault: unknown }>> {
    return new $BooleanAttribute(overwrite(this.state, { putDefault: nextPutDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<
      AttributeUpdateItemInput<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>, true>
    >
  ): $BooleanAttribute<Overwrite<STATE, { updateDefault: unknown }>> {
    return new $BooleanAttribute(
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
        ValidValue<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>, { mode: 'key' }>,
        ValidValue<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>>
      >
    >
  ): If<
    STATE['key'],
    $BooleanAttribute<Overwrite<STATE, { keyDefault: unknown }>>,
    $BooleanAttribute<Overwrite<STATE, { putDefault: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $BooleanAttribute(overwrite(this.state, { keyDefault: nextDefault as unknown })),
      new $BooleanAttribute(overwrite(this.state, { putDefault: nextDefault as unknown }))
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
    ) => ValidValue<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>, { mode: 'key' }>
  ): $BooleanAttribute<Overwrite<STATE, { keyLink: unknown }>> {
    return new $BooleanAttribute(overwrite(this.state, { keyLink: nextKeyLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (
      putItemInput: ValidValue<SCHEMA>
    ) => ValidValue<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>>
  ): $BooleanAttribute<Overwrite<STATE, { putLink: unknown }>> {
    return new $BooleanAttribute(overwrite(this.state, { putLink: nextPutLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in UPDATE commands
   *
   * @param nextUpdateLink `unknown | ((updateItemInput) => updateAttributeInput)`
   */
  updateLink<SCHEMA extends Schema>(
    nextUpdateLink: (
      updateItemInput: UpdateItemInput<SCHEMA, true>
    ) => AttributeUpdateItemInput<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>, true>
  ): $BooleanAttribute<Overwrite<STATE, { updateLink: unknown }>> {
    return new $BooleanAttribute(overwrite(this.state, { updateLink: nextUpdateLink as unknown }))
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
      ValidValue<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>, { mode: 'key' }>,
      ValidValue<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>>
    >
  ): If<
    STATE['key'],
    $BooleanAttribute<Overwrite<STATE, { keyLink: unknown }>>,
    $BooleanAttribute<Overwrite<STATE, { putLink: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $BooleanAttribute(overwrite(this.state, { keyLink: nextLink as unknown })),
      new $BooleanAttribute(overwrite(this.state, { putLink: nextLink as unknown }))
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
        FreezeBooleanAttribute<$BooleanAttributeState<STATE>>,
        { mode: 'key'; defined: true }
      >,
      FreezeBooleanAttribute<$BooleanAttributeState<STATE>>
    >
  ): $BooleanAttribute<Overwrite<STATE, { keyValidator: Validator }>> {
    return new $BooleanAttribute(
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
      ValidValue<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>, { defined: true }>,
      FreezeBooleanAttribute<$BooleanAttributeState<STATE>>
    >
  ): $BooleanAttribute<Overwrite<STATE, { putValidator: Validator }>> {
    return new $BooleanAttribute(
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
      AttributeUpdateItemInput<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>, true>,
      FreezeBooleanAttribute<$BooleanAttributeState<STATE>>
    >
  ): $BooleanAttribute<Overwrite<STATE, { updateValidator: Validator }>> {
    return new $BooleanAttribute(
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
          FreezeBooleanAttribute<$BooleanAttributeState<STATE>>,
          { mode: 'key'; defined: true }
        >,
        ValidValue<FreezeBooleanAttribute<$BooleanAttributeState<STATE>>, { defined: true }>
      >,
      FreezeBooleanAttribute<$BooleanAttributeState<STATE>>
    >
  ): If<
    STATE['key'],
    $BooleanAttribute<Overwrite<STATE, { keyValidator: Validator }>>,
    $BooleanAttribute<Overwrite<STATE, { putValidator: Validator }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $BooleanAttribute(overwrite(this.state, { keyValidator: nextValidator as Validator })),
      new $BooleanAttribute(overwrite(this.state, { putValidator: nextValidator as Validator }))
    )
  }

  freeze(path?: string): FreezeBooleanAttribute<$BooleanAttributeState<STATE>, true> {
    return freezeBooleanAttribute(this.state, path)
  }
}

export class BooleanAttribute<STATE extends BooleanAttributeState = BooleanAttributeState> {
  type: 'boolean'
  path?: string
  state: STATE

  constructor({ path, ...state }: STATE & { path?: string }) {
    this.type = 'boolean'
    this.path = path
    this.state = state as STATE
  }
}

export class BooleanAttribute_<
  STATE extends BooleanAttributeState = BooleanAttributeState
> extends BooleanAttribute<STATE> {
  clone<NEXT_STATE extends Partial<BooleanAttributeState> = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): BooleanAttribute_<ConstrainedOverwrite<BooleanAttributeState, STATE, NEXT_STATE>> {
    return new BooleanAttribute_({
      ...(this.path !== undefined ? { path: this.path } : {}),
      ...this.state,
      ...nextState
    } as ConstrainedOverwrite<BooleanAttributeState, STATE, NEXT_STATE>)
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
