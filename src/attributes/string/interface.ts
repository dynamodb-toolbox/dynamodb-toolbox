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
import type { FreezeStringAttribute } from './freeze.js'
import { freezeStringAttribute } from './freeze.js'
import type { ResolveStringAttribute, ResolvedStringAttribute } from './resolve.js'
import type { StringAttributeState } from './types.js'

export interface $StringAttributeState<STATE extends StringAttributeState = StringAttributeState> {
  type: 'string'
  state: STATE
}

export interface $StringAttributeNestedState<
  STATE extends StringAttributeState = StringAttributeState
> extends $StringAttributeState<STATE> {
  path?: string
  check: (path?: string) => void
  freeze: (path?: string) => FreezeStringAttribute<$StringAttributeState<STATE>, true>
}

/**
 * String attribute (warm)
 */
export class $StringAttribute<STATE extends StringAttributeState = StringAttributeState>
  implements $StringAttributeNestedState<STATE>
{
  type: 'string'
  path?: string
  state: STATE

  constructor(state: STATE) {
    this.type = 'string'
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
  ): $StringAttribute<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>> {
    return new $StringAttribute(overwrite(this.state, { required: nextRequired }))
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): $StringAttribute<Overwrite<STATE, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): $StringAttribute<Overwrite<STATE, { hidden: NEXT_HIDDEN }>> {
    return new $StringAttribute(overwrite(this.state, { hidden: nextHidden }))
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): $StringAttribute<Overwrite<STATE, { key: NEXT_KEY; required: Always }>> {
    return new $StringAttribute(overwrite(this.state, { key: nextKey, required: 'always' }))
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): $StringAttribute<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>> {
    return new $StringAttribute(overwrite(this.state, { savedAs: nextSavedAs }))
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
    const NEXT_ENUM extends readonly ResolveStringAttribute<
      FreezeStringAttribute<$StringAttributeState<STATE>>
    >[]
  >(...nextEnum: NEXT_ENUM): $StringAttribute<Overwrite<STATE, { enum: Writable<NEXT_ENUM> }>> {
    return new $StringAttribute(overwrite(this.state, { enum: writable(nextEnum) }))
  }

  /**
   * Shorthand for `enum(constantValue).default(constantValue)`
   *
   * @param constantValue Constant value
   * @example
   * string().const('foo')
   */
  const<
    CONSTANT extends ResolveStringAttribute<FreezeStringAttribute<$StringAttributeState<STATE>>>
  >(
    constant: CONSTANT
  ): If<
    STATE['key'],
    $StringAttribute<Overwrite<STATE, { enum: [CONSTANT]; keyDefault: unknown }>>,
    $StringAttribute<Overwrite<STATE, { enum: [CONSTANT]; putDefault: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $StringAttribute(
        overwrite(this.state, { enum: [constant] as [CONSTANT], keyDefault: constant as unknown })
      ),
      new $StringAttribute(
        overwrite(this.state, { enum: [constant] as [CONSTANT], putDefault: constant as unknown })
      )
    )
  }

  /**
   * Transform the attribute value in PUT commands OR Primary Key computing if attribute is tagged as key
   */
  transform<
    TRANSFORMER extends Transformer<
      ResolvedStringAttribute,
      ResolveStringAttribute<FreezeStringAttribute<$StringAttributeState<STATE>>>
    >
  >(transform: TRANSFORMER): $StringAttribute<Overwrite<STATE, { transform: TRANSFORMER }>> {
    return new $StringAttribute(overwrite(this.state, { transform }))
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<
      ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>, { mode: 'key' }>
    >
  ): $StringAttribute<Overwrite<STATE, { keyDefault: unknown }>> {
    return new $StringAttribute(overwrite(this.state, { keyDefault: nextKeyDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>>>
  ): $StringAttribute<Overwrite<STATE, { putDefault: unknown }>> {
    return new $StringAttribute(overwrite(this.state, { putDefault: nextPutDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<
      AttributeUpdateItemInput<FreezeStringAttribute<$StringAttributeState<STATE>>, true>
    >
  ): $StringAttribute<Overwrite<STATE, { updateDefault: unknown }>> {
    return new $StringAttribute(
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
        ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>, { mode: 'key' }>,
        ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>>
      >
    >
  ): If<
    STATE['key'],
    $StringAttribute<Overwrite<STATE, { keyDefault: unknown }>>,
    $StringAttribute<Overwrite<STATE, { putDefault: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $StringAttribute(overwrite(this.state, { keyDefault: nextDefault as unknown })),
      new $StringAttribute(overwrite(this.state, { putDefault: nextDefault as unknown }))
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
    ) => ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>, { mode: 'key' }>
  ): $StringAttribute<Overwrite<STATE, { keyLink: unknown }>> {
    return new $StringAttribute(overwrite(this.state, { keyLink: nextKeyLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (
      putItemInput: ValidValue<SCHEMA>
    ) => ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>>
  ): $StringAttribute<Overwrite<STATE, { putLink: unknown }>> {
    return new $StringAttribute(overwrite(this.state, { putLink: nextPutLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in UPDATE commands
   *
   * @param nextUpdateLink `unknown | ((updateItemInput) => updateAttributeInput)`
   */
  updateLink<SCHEMA extends Schema>(
    nextUpdateLink: (
      updateItemInput: UpdateItemInput<SCHEMA, true>
    ) => AttributeUpdateItemInput<FreezeStringAttribute<$StringAttributeState<STATE>>, true>
  ): $StringAttribute<Overwrite<STATE, { updateLink: unknown }>> {
    return new $StringAttribute(overwrite(this.state, { updateLink: nextUpdateLink as unknown }))
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
      ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>, { mode: 'key' }>,
      ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>>
    >
  ): If<
    STATE['key'],
    $StringAttribute<Overwrite<STATE, { keyLink: unknown }>>,
    $StringAttribute<Overwrite<STATE, { putLink: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $StringAttribute(overwrite(this.state, { keyLink: nextLink as unknown })),
      new $StringAttribute(overwrite(this.state, { putLink: nextLink as unknown }))
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
        FreezeStringAttribute<$StringAttributeState<STATE>>,
        { mode: 'key'; defined: true }
      >,
      FreezeStringAttribute<$StringAttributeState<STATE>>
    >
  ): $StringAttribute<Overwrite<STATE, { keyValidator: Validator }>> {
    return new $StringAttribute(
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
      ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>, { defined: true }>,
      FreezeStringAttribute<$StringAttributeState<STATE>>
    >
  ): $StringAttribute<Overwrite<STATE, { putValidator: Validator }>> {
    return new $StringAttribute(
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
      AttributeUpdateItemInput<FreezeStringAttribute<$StringAttributeState<STATE>>, true>,
      FreezeStringAttribute<$StringAttributeState<STATE>>
    >
  ): $StringAttribute<Overwrite<STATE, { updateValidator: Validator }>> {
    return new $StringAttribute(
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
          FreezeStringAttribute<$StringAttributeState<STATE>>,
          { mode: 'key'; defined: true }
        >,
        ValidValue<FreezeStringAttribute<$StringAttributeState<STATE>>, { defined: true }>
      >,
      FreezeStringAttribute<$StringAttributeState<STATE>>
    >
  ): If<
    STATE['key'],
    $StringAttribute<Overwrite<STATE, { keyValidator: Validator }>>,
    $StringAttribute<Overwrite<STATE, { putValidator: Validator }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new $StringAttribute(overwrite(this.state, { keyValidator: nextValidator as Validator })),
      new $StringAttribute(overwrite(this.state, { putValidator: nextValidator as Validator }))
    )
  }

  freeze(path?: string): FreezeStringAttribute<$StringAttributeState<STATE>, true> {
    return freezeStringAttribute(this.state, path)
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

export class StringAttribute<STATE extends StringAttributeState = StringAttributeState> {
  type: 'string'
  path?: string
  state: STATE

  constructor({ path, ...state }: STATE & { path?: string }) {
    this.type = 'string'
    this.path = path
    this.state = state as STATE
  }
}

export class StringAttribute_<
  STATE extends StringAttributeState = StringAttributeState
> extends StringAttribute<STATE> {
  clone<NEXT_STATE extends Partial<StringAttributeState> = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): StringAttribute_<ConstrainedOverwrite<StringAttributeState, STATE, NEXT_STATE>> {
    return new StringAttribute_({
      ...(this.path !== undefined ? { path: this.path } : {}),
      ...this.state,
      ...nextState
    } as ConstrainedOverwrite<StringAttributeState, STATE, NEXT_STATE>)
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
