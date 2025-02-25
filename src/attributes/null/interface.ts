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
import { validatePrimitiveAttribute } from '../primitive/freeze.js'
import type { Validator } from '../types/validator.js'
import type { FreezeNullAttribute } from './freeze.js'
import { freezeNullAttribute } from './freeze.js'
import type { ResolvedNullAttribute } from './resolve.js'
import type { NullAttributeState } from './types.js'

export interface $NullAttributeState<STATE extends NullAttributeState = NullAttributeState> {
  type: 'null'
  state: STATE
}

export interface $NullAttributeNestedState<STATE extends NullAttributeState = NullAttributeState>
  extends $NullAttributeState<STATE> {
  path?: string
  check: (path?: string) => void
  freeze: (path?: string) => FreezeNullAttribute<$NullAttributeState<STATE>, true>
}

/**
 * Null attribute (warm)
 */
export class $NullAttribute<STATE extends NullAttributeState = NullAttributeState>
  implements $NullAttributeNestedState<STATE>
{
  type: 'null'
  path?: string
  state: STATE

  constructor(state: STATE) {
    this.type = 'null'
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
  ): $NullAttribute<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>> {
    return new $NullAttribute(overwrite(this.state, { required: nextRequired }))
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $NullAttribute<Overwrite<STATE, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $NullAttribute<Overwrite<STATE, { hidden: NEXT_HIDDEN }>> {
    return new $NullAttribute(overwrite(this.state, { hidden: nextHidden }))
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $NullAttribute<Overwrite<STATE, { key: NEXT_KEY; required: Always }>> {
    return new $NullAttribute(overwrite(this.state, { key: nextKey, required: 'always' }))
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $NullAttribute<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>> {
    return new $NullAttribute(overwrite(this.state, { savedAs: nextSavedAs }))
  }

  /**
   * Provide a finite list of possible values for attribute
   * (For typing reasons, enums are only available as attribute methods, not as input options)
   *
   * @param enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum<const NEXT_ENUM extends readonly ResolvedNullAttribute[]>(
    ...nextEnum: NEXT_ENUM
  ): $NullAttribute<Overwrite<STATE, { enum: Writable<NEXT_ENUM> }>> {
    return new $NullAttribute(overwrite(this.state, { enum: writable(nextEnum) }))
  }

  /**
   * Shorthand for `enum(constantValue).default(constantValue)`
   *
   * @param constantValue Constant value
   * @example
   * string().const('foo')
   */
  const<CONSTANT extends ResolvedNullAttribute>(
    constant: CONSTANT
  ): If<
    STATE['key'],
    $NullAttribute<Overwrite<STATE, { enum: [CONSTANT]; keyDefault: unknown }>>,
    $NullAttribute<Overwrite<STATE, { enum: [CONSTANT]; putDefault: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $NullAttribute(
        overwrite(this.state, { enum: [constant] as [CONSTANT], keyDefault: constant as unknown })
      ),
      new $NullAttribute(
        overwrite(this.state, { enum: [constant] as [CONSTANT], putDefault: constant as unknown })
      )
    )
  }

  /**
   * Transform the attribute value in PUT commands OR Primary Key computing if attribute is tagged as key
   */
  transform<TRANSFORMER extends Transformer<ResolvedNullAttribute>>(
    transform: TRANSFORMER
  ): $NullAttribute<Overwrite<STATE, { transform: TRANSFORMER }>> {
    return new $NullAttribute(overwrite(this.state, { transform }))
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ValidValue<FreezeNullAttribute<$NullAttributeState<STATE>>, { mode: 'key' }>
    >
  ): $NullAttribute<Overwrite<STATE, { keyDefault: unknown }>> {
    return new $NullAttribute(overwrite(this.state, { keyDefault: nextKeyDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<FreezeNullAttribute<$NullAttributeState<STATE>>>>
  ): $NullAttribute<Overwrite<STATE, { putDefault: unknown }>> {
    return new $NullAttribute(overwrite(this.state, { putDefault: nextPutDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<
      AttributeUpdateItemInput<FreezeNullAttribute<$NullAttributeState<STATE>>, true>
    >
  ): $NullAttribute<Overwrite<STATE, { updateDefault: unknown }>> {
    return new $NullAttribute(
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
        ValidValue<FreezeNullAttribute<$NullAttributeState<STATE>>, { mode: 'key' }>,
        ValidValue<FreezeNullAttribute<$NullAttributeState<STATE>>>
      >
    >
  ): If<
    STATE['key'],
    $NullAttribute<Overwrite<STATE, { keyDefault: unknown }>>,
    $NullAttribute<Overwrite<STATE, { putDefault: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $NullAttribute(overwrite(this.state, { keyDefault: nextDefault as unknown })),
      new $NullAttribute(overwrite(this.state, { putDefault: nextDefault as unknown }))
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
    ) => ValidValue<FreezeNullAttribute<$NullAttributeState<STATE>>, { mode: 'key' }>
  ): $NullAttribute<Overwrite<STATE, { keyLink: unknown }>> {
    return new $NullAttribute(overwrite(this.state, { keyLink: nextKeyLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (
      putItemInput: ValidValue<SCHEMA>
    ) => ValidValue<FreezeNullAttribute<$NullAttributeState<STATE>>>
  ): $NullAttribute<Overwrite<STATE, { putLink: unknown }>> {
    return new $NullAttribute(overwrite(this.state, { putLink: nextPutLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in UPDATE commands
   *
   * @param nextUpdateLink `unknown | ((updateItemInput) => updateAttributeInput)`
   */
  updateLink<SCHEMA extends Schema>(
    nextUpdateLink: (
      updateItemInput: UpdateItemInput<SCHEMA, true>
    ) => AttributeUpdateItemInput<FreezeNullAttribute<$NullAttributeState<STATE>>, true>
  ): $NullAttribute<Overwrite<STATE, { updateLink: unknown }>> {
    return new $NullAttribute(overwrite(this.state, { updateLink: nextUpdateLink as unknown }))
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
      ValidValue<FreezeNullAttribute<$NullAttributeState<STATE>>, { mode: 'key' }>,
      ValidValue<FreezeNullAttribute<$NullAttributeState<STATE>>>
    >
  ): If<
    STATE['key'],
    $NullAttribute<Overwrite<STATE, { keyLink: unknown }>>,
    $NullAttribute<Overwrite<STATE, { putLink: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $NullAttribute(overwrite(this.state, { keyLink: nextLink as unknown })),
      new $NullAttribute(overwrite(this.state, { putLink: nextLink as unknown }))
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => null | string`
   */
  keyValidate(
    nextKeyValidator: Validator<
      ValidValue<FreezeNullAttribute<$NullAttributeState<STATE>>, { mode: 'key'; defined: true }>,
      FreezeNullAttribute<$NullAttributeState<STATE>>
    >
  ): $NullAttribute<Overwrite<STATE, { keyValidator: Validator }>> {
    return new $NullAttribute(
      overwrite(this.state, { keyValidator: nextKeyValidator as Validator })
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => null | string`
   */
  putValidate(
    nextPutValidator: Validator<
      ValidValue<FreezeNullAttribute<$NullAttributeState<STATE>>, { defined: true }>,
      FreezeNullAttribute<$NullAttributeState<STATE>>
    >
  ): $NullAttribute<Overwrite<STATE, { putValidator: Validator }>> {
    return new $NullAttribute(
      overwrite(this.state, { putValidator: nextPutValidator as Validator })
    )
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => null | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<
      AttributeUpdateItemInput<FreezeNullAttribute<$NullAttributeState<STATE>>, true>,
      FreezeNullAttribute<$NullAttributeState<STATE>>
    >
  ): $NullAttribute<Overwrite<STATE, { updateValidator: Validator }>> {
    return new $NullAttribute(
      overwrite(this.state, { updateValidator: nextUpdateValidator as Validator })
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextValidator `(key/putAttributeInput) => null | string`
   */
  validate(
    nextValidator: Validator<
      If<
        STATE['key'],
        ValidValue<FreezeNullAttribute<$NullAttributeState<STATE>>, { mode: 'key'; defined: true }>,
        ValidValue<FreezeNullAttribute<$NullAttributeState<STATE>>, { defined: true }>
      >,
      FreezeNullAttribute<$NullAttributeState<STATE>>
    >
  ): If<
    STATE['key'],
    $NullAttribute<Overwrite<STATE, { keyValidator: Validator }>>,
    $NullAttribute<Overwrite<STATE, { putValidator: Validator }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $NullAttribute(overwrite(this.state, { keyValidator: nextValidator as Validator })),
      new $NullAttribute(overwrite(this.state, { putValidator: nextValidator as Validator }))
    )
  }

  freeze(path?: string): FreezeNullAttribute<$NullAttributeState<STATE>, true> {
    return freezeNullAttribute(this.state, path)
  }

  get checked(): boolean {
    return Object.isFrozen(this.state)
  }

  check(path?: string): void {
    if (this.checked) {
      return
    }

    validatePrimitiveAttribute(this, path)

    Object.freeze(this.state)
    if (path !== undefined) {
      this.path = path
    }
  }
}

export class NullAttribute<STATE extends NullAttributeState = NullAttributeState> {
  type: 'null'
  path?: string
  state: STATE

  constructor({ path, ...state }: STATE & { path?: string }) {
    this.type = 'null'
    this.path = path
    this.state = state as STATE
  }
}

export class NullAttribute_<
  STATE extends NullAttributeState = NullAttributeState
> extends NullAttribute<STATE> {
  clone<NEXT_STATE extends Partial<NullAttributeState> = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): NullAttribute_<ConstrainedOverwrite<NullAttributeState, STATE, NEXT_STATE>> {
    return new NullAttribute_({
      ...(this.path !== undefined ? { path: this.path } : {}),
      ...this.state,
      ...nextState
    } as ConstrainedOverwrite<NullAttributeState, STATE, NEXT_STATE>)
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
