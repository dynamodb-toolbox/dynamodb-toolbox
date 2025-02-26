/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { AttributeUpdateItemInput, UpdateItemInput } from '~/entity/actions/update/types.js'
import type { Schema, SchemaAction, ValidValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/index.js'
import type { If, NarrowObject, Overwrite, ValueOrGetter, Writable } from '~/types/index.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'
import { writable } from '~/utils/writable.js'

import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/requiredOptions.js'
import type { Validator } from '../types/validator.js'
import type { ResolveBooleanSchema, ResolvedBooleanSchema } from './resolve.js'
import { BooleanSchema } from './schema.js'
import type { BooleanAttributeState } from './types.js'

type BooleanAttributeTyper = <STATE extends BooleanAttributeState = {}>(
  state?: NarrowObject<STATE>
) => BooleanSchema_<STATE>

/**
 * Define a new attribute of boolean type
 *
 * @param state _(optional)_ Attribute Options
 */
export const boolean: BooleanAttributeTyper = <STATE extends BooleanAttributeState = {}>(
  state: NarrowObject<STATE> = {} as STATE
) => new BooleanSchema_(state)

/**
 * Boolean attribute (warm)
 */
export class BooleanSchema_<
  STATE extends BooleanAttributeState = BooleanAttributeState
> extends BooleanSchema<STATE> {
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
  ): BooleanSchema_<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>> {
    return new BooleanSchema_(overwrite(this.state, { required: nextRequired }))
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): BooleanSchema_<Overwrite<STATE, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): BooleanSchema_<Overwrite<STATE, { hidden: NEXT_HIDDEN }>> {
    return new BooleanSchema_(overwrite(this.state, { hidden: nextHidden }))
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): BooleanSchema_<Overwrite<STATE, { key: NEXT_KEY; required: Always }>> {
    return new BooleanSchema_(overwrite(this.state, { key: nextKey, required: 'always' }))
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): BooleanSchema_<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>> {
    return new BooleanSchema_(overwrite(this.state, { savedAs: nextSavedAs }))
  }

  /**
   * Provide a finite list of possible values for attribute
   * (For typing reasons, enums are only available as attribute methods, not as input options)
   *
   * @param enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum<const NEXT_ENUM extends readonly ResolveBooleanSchema<this>[]>(
    ...nextEnum: NEXT_ENUM
  ): BooleanSchema_<Overwrite<STATE, { enum: Writable<NEXT_ENUM> }>> {
    return new BooleanSchema_(overwrite(this.state, { enum: writable(nextEnum) }))
  }

  /**
   * Shorthand for `enum(constantValue).default(constantValue)`
   *
   * @param constantValue Constant value
   * @example
   * string().const('foo')
   */
  const<CONSTANT extends ResolveBooleanSchema<this>>(
    constant: CONSTANT
  ): If<
    STATE['key'],
    BooleanSchema_<Overwrite<STATE, { enum: [CONSTANT]; keyDefault: unknown }>>,
    BooleanSchema_<Overwrite<STATE, { enum: [CONSTANT]; putDefault: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new BooleanSchema_(
        overwrite(this.state, { enum: [constant] as [CONSTANT], keyDefault: constant as unknown })
      ),
      new BooleanSchema_(
        overwrite(this.state, { enum: [constant] as [CONSTANT], putDefault: constant as unknown })
      )
    )
  }

  /**
   * Transform the attribute value in PUT commands OR Primary Key computing if attribute is tagged as key
   */
  transform<TRANSFORMER extends Transformer<ResolvedBooleanSchema, ResolveBooleanSchema<this>>>(
    transform: TRANSFORMER
  ): BooleanSchema_<Overwrite<STATE, { transform: TRANSFORMER }>> {
    return new BooleanSchema_(overwrite(this.state, { transform }))
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): BooleanSchema_<Overwrite<STATE, { keyDefault: unknown }>> {
    return new BooleanSchema_(overwrite(this.state, { keyDefault: nextKeyDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<this>>
  ): BooleanSchema_<Overwrite<STATE, { putDefault: unknown }>> {
    return new BooleanSchema_(overwrite(this.state, { putDefault: nextPutDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<AttributeUpdateItemInput<this, true>>
  ): BooleanSchema_<Overwrite<STATE, { updateDefault: unknown }>> {
    return new BooleanSchema_(
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
      If<STATE['key'], ValidValue<this, { mode: 'key' }>, ValidValue<this>>
    >
  ): If<
    STATE['key'],
    BooleanSchema_<Overwrite<STATE, { keyDefault: unknown }>>,
    BooleanSchema_<Overwrite<STATE, { putDefault: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new BooleanSchema_(overwrite(this.state, { keyDefault: nextDefault as unknown })),
      new BooleanSchema_(overwrite(this.state, { putDefault: nextDefault as unknown }))
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
    ) => ValidValue<this, { mode: 'key' }>
  ): BooleanSchema_<Overwrite<STATE, { keyLink: unknown }>> {
    return new BooleanSchema_(overwrite(this.state, { keyLink: nextKeyLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (putItemInput: ValidValue<SCHEMA>) => ValidValue<this>
  ): BooleanSchema_<Overwrite<STATE, { putLink: unknown }>> {
    return new BooleanSchema_(overwrite(this.state, { putLink: nextPutLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in UPDATE commands
   *
   * @param nextUpdateLink `unknown | ((updateItemInput) => updateAttributeInput)`
   */
  updateLink<SCHEMA extends Schema>(
    nextUpdateLink: (
      updateItemInput: UpdateItemInput<SCHEMA, true>
    ) => AttributeUpdateItemInput<this, true>
  ): BooleanSchema_<Overwrite<STATE, { updateLink: unknown }>> {
    return new BooleanSchema_(overwrite(this.state, { updateLink: nextUpdateLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextLink `key/putAttributeInput | (() => key/putAttributeInput)`
   */
  link<SCHEMA extends Schema>(
    nextLink: (
      keyOrPutItemInput: If<STATE['key'], ValidValue<SCHEMA, { mode: 'key' }>, ValidValue<SCHEMA>>
    ) => If<STATE['key'], ValidValue<this, { mode: 'key' }>, ValidValue<this>>
  ): If<
    STATE['key'],
    BooleanSchema_<Overwrite<STATE, { keyLink: unknown }>>,
    BooleanSchema_<Overwrite<STATE, { putLink: unknown }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new BooleanSchema_(overwrite(this.state, { keyLink: nextLink as unknown })),
      new BooleanSchema_(overwrite(this.state, { putLink: nextLink as unknown }))
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<ValidValue<this, { mode: 'key'; defined: true }>, this>
  ): BooleanSchema_<Overwrite<STATE, { keyValidator: Validator }>> {
    return new BooleanSchema_(
      overwrite(this.state, { keyValidator: nextKeyValidator as Validator })
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => boolean | string`
   */
  putValidate(
    nextPutValidator: Validator<ValidValue<this, { defined: true }>, this>
  ): BooleanSchema_<Overwrite<STATE, { putValidator: Validator }>> {
    return new BooleanSchema_(
      overwrite(this.state, { putValidator: nextPutValidator as Validator })
    )
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => boolean | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<AttributeUpdateItemInput<this, true>, this>
  ): BooleanSchema_<Overwrite<STATE, { updateValidator: Validator }>> {
    return new BooleanSchema_(
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
        ValidValue<this, { mode: 'key'; defined: true }>,
        ValidValue<this, { defined: true }>
      >,
      this
    >
  ): If<
    STATE['key'],
    BooleanSchema_<Overwrite<STATE, { keyValidator: Validator }>>,
    BooleanSchema_<Overwrite<STATE, { putValidator: Validator }>>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new BooleanSchema_(overwrite(this.state, { keyValidator: nextValidator as Validator })),
      new BooleanSchema_(overwrite(this.state, { putValidator: nextValidator as Validator }))
    )
  }

  clone<NEXT_STATE extends Partial<BooleanAttributeState> = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): BooleanSchema_<Overwrite<STATE, NEXT_STATE>> {
    return new BooleanSchema_(overwrite(this.state, nextState))
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
