/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { AttributeUpdateItemInput, UpdateItemInput } from '~/entity/actions/update/types.js'
import type { Schema, SchemaAction, ValidValue } from '~/schema/index.js'
import type { If, NarrowObject, Overwrite, ValueOrGetter } from '~/types/index.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'

import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { AttrSchema } from '../types/index.js'
import type { Validator } from '../types/validator.js'
import { AnyOfSchema } from './schema.js'
import type { AnyOfElementSchema } from './types.js'

type AnyOfAttributeTyper = <ELEMENTS extends AnyOfElementSchema[]>(
  ...elements: ELEMENTS
) => AnyOfSchema_<{}, ELEMENTS>

/**
 * Define a new anyOf attribute
 * @param elements Attribute[]
 */
export const anyOf: AnyOfAttributeTyper = <ELEMENTS extends AnyOfElementSchema[]>(
  ...elements: ELEMENTS
) => new AnyOfSchema_({}, elements)

/**
 * AnyOf attribute interface
 */
export class AnyOfSchema_<
  STATE extends SharedAttributeState = SharedAttributeState,
  ELEMENTS extends AttrSchema[] = AttrSchema[]
> extends AnyOfSchema<STATE, ELEMENTS> {
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
  ): AnyOfSchema_<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>, ELEMENTS> {
    return new AnyOfSchema_(overwrite(this.state, { required: nextRequired }), this.elements)
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): AnyOfSchema_<Overwrite<STATE, { required: Never }>, ELEMENTS> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): AnyOfSchema_<Overwrite<STATE, { hidden: NEXT_HIDDEN }>, ELEMENTS> {
    return new AnyOfSchema_(overwrite(this.state, { hidden: nextHidden }), this.elements)
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): AnyOfSchema_<Overwrite<STATE, { key: NEXT_KEY; required: Always }>, ELEMENTS> {
    return new AnyOfSchema_(
      overwrite(this.state, { key: nextKey, required: 'always' }),
      this.elements
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): AnyOfSchema_<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>, ELEMENTS> {
    return new AnyOfSchema_(overwrite(this.state, { savedAs: nextSavedAs }), this.elements)
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): AnyOfSchema_<Overwrite<STATE, { keyDefault: unknown }>, ELEMENTS> {
    return new AnyOfSchema_(
      overwrite(this.state, { keyDefault: nextKeyDefault as unknown }),
      this.elements
    )
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<this>>
  ): AnyOfSchema_<Overwrite<STATE, { putDefault: unknown }>, ELEMENTS> {
    return new AnyOfSchema_(
      overwrite(this.state, { putDefault: nextPutDefault as unknown }),
      this.elements
    )
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<AttributeUpdateItemInput<this, true>>
  ): AnyOfSchema_<Overwrite<STATE, { updateDefault: unknown }>, ELEMENTS> {
    return new AnyOfSchema_(
      overwrite(this.state, { updateDefault: nextUpdateDefault as unknown }),
      this.elements
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
    AnyOfSchema_<Overwrite<STATE, { keyDefault: unknown }>, ELEMENTS>,
    AnyOfSchema_<Overwrite<STATE, { putDefault: unknown }>, ELEMENTS>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new AnyOfSchema_(
        overwrite(this.state, { keyDefault: nextDefault as unknown }),
        this.elements
      ),
      new AnyOfSchema_(overwrite(this.state, { putDefault: nextDefault as unknown }), this.elements)
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
  ): AnyOfSchema_<Overwrite<STATE, { keyLink: unknown }>, ELEMENTS> {
    return new AnyOfSchema_(
      overwrite(this.state, { keyLink: nextKeyLink as unknown }),
      this.elements
    )
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (putItemInput: ValidValue<SCHEMA>) => ValidValue<this>
  ): AnyOfSchema_<Overwrite<STATE, { putLink: unknown }>, ELEMENTS> {
    return new AnyOfSchema_(
      overwrite(this.state, { putLink: nextPutLink as unknown }),
      this.elements
    )
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
  ): AnyOfSchema_<Overwrite<STATE, { updateLink: unknown }>, ELEMENTS> {
    return new AnyOfSchema_(
      overwrite(this.state, { updateLink: nextUpdateLink as unknown }),
      this.elements
    )
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
    AnyOfSchema_<Overwrite<STATE, { keyLink: unknown }>, ELEMENTS>,
    AnyOfSchema_<Overwrite<STATE, { putLink: unknown }>, ELEMENTS>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new AnyOfSchema_(overwrite(this.state, { keyLink: nextLink as unknown }), this.elements),
      new AnyOfSchema_(overwrite(this.state, { putLink: nextLink as unknown }), this.elements)
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<ValidValue<this, { mode: 'key'; defined: true }>, this>
  ): AnyOfSchema_<Overwrite<STATE, { keyValidator: Validator }>, ELEMENTS> {
    return new AnyOfSchema_(
      overwrite(this.state, { keyValidator: nextKeyValidator as Validator }),
      this.elements
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => boolean | string`
   */
  putValidate(
    nextPutValidator: Validator<ValidValue<this, { defined: true }>, this>
  ): AnyOfSchema_<Overwrite<STATE, { putValidator: Validator }>, ELEMENTS> {
    return new AnyOfSchema_(
      overwrite(this.state, { putValidator: nextPutValidator as Validator }),
      this.elements
    )
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => boolean | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<AttributeUpdateItemInput<this, true>, this>
  ): AnyOfSchema_<Overwrite<STATE, { updateValidator: Validator }>, ELEMENTS> {
    return new AnyOfSchema_(
      overwrite(this.state, { updateValidator: nextUpdateValidator as Validator }),
      this.elements
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
    AnyOfSchema_<Overwrite<STATE, { keyValidator: Validator }>, ELEMENTS>,
    AnyOfSchema_<Overwrite<STATE, { putValidator: Validator }>, ELEMENTS>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new AnyOfSchema_(
        overwrite(this.state, { keyValidator: nextValidator as Validator }),
        this.elements
      ),
      new AnyOfSchema_(
        overwrite(this.state, { putValidator: nextValidator as Validator }),
        this.elements
      )
    )
  }

  clone<NEXT_STATE extends SharedAttributeState = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): AnyOfSchema_<Overwrite<STATE, NEXT_STATE>, ELEMENTS> {
    return new AnyOfSchema_(overwrite(this.state, nextState), this.elements)
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
