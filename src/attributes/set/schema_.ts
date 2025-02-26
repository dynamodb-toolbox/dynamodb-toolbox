/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { AttributeUpdateItemInput, UpdateItemInput } from '~/entity/actions/update/types.js'
import type { Schema, SchemaAction, ValidValue } from '~/schema/index.js'
import type { If, NarrowObject, Overwrite, ValueOrGetter } from '~/types/index.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'

import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/requiredOptions.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { Validator } from '../types/validator.js'
import { SetSchema } from './schema.js'
import type { SetElementSchema } from './types.js'

type SetAttributeTyper = <
  $ELEMENTS extends SetElementSchema,
  STATE extends SharedAttributeState = {}
>(
  elements: $ELEMENTS,
  state?: NarrowObject<STATE>
) => SetSchema_<STATE, $ELEMENTS>

/**
 * Define a new set attribute
 * Note that set elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not renamed (savedAs: undefined)
 * - Not defaulted (defaults: undefined)
 *
 * @param elements Attribute (With constraints)
 * @param state _(optional)_ List Options
 */
export const set: SetAttributeTyper = <
  ELEMENTS extends SetElementSchema,
  STATE extends SharedAttributeState = {}
>(
  elements: ELEMENTS,
  state: NarrowObject<STATE> = {} as STATE
) => new SetSchema_(state, elements)

export interface $SetAttributeNestedState<
  STATE extends SharedAttributeState = SharedAttributeState,
  ELEMENTS extends SetElementSchema = SetElementSchema
> extends SetSchema<STATE, ELEMENTS> {
  check: (path?: string) => void
}

/**
 * Set attribute interface
 */
export class SetSchema_<
  STATE extends SharedAttributeState = SharedAttributeState,
  ELEMENTS extends SetElementSchema = SetElementSchema
> extends SetSchema<STATE, ELEMENTS> {
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
  ): SetSchema_<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>, ELEMENTS> {
    return new SetSchema_(overwrite(this.state, { required: nextRequired }), this.elements)
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): SetSchema_<Overwrite<STATE, { required: Never }>, ELEMENTS> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): SetSchema_<Overwrite<STATE, { hidden: NEXT_HIDDEN }>, ELEMENTS> {
    return new SetSchema_(overwrite(this.state, { hidden: nextHidden }), this.elements)
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): SetSchema_<Overwrite<STATE, { key: NEXT_KEY; required: Always }>, ELEMENTS> {
    return new SetSchema_(
      overwrite(this.state, { key: nextKey, required: 'always' }),
      this.elements
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): SetSchema_<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>, ELEMENTS> {
    return new SetSchema_(overwrite(this.state, { savedAs: nextSavedAs }), this.elements)
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): SetSchema_<Overwrite<STATE, { keyDefault: unknown }>, ELEMENTS> {
    return new SetSchema_(
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
  ): SetSchema_<Overwrite<STATE, { putDefault: unknown }>, ELEMENTS> {
    return new SetSchema_(
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
  ): SetSchema_<Overwrite<STATE, { updateDefault: unknown }>, ELEMENTS> {
    return new SetSchema_(
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
    SetSchema_<Overwrite<STATE, { keyDefault: unknown }>, ELEMENTS>,
    SetSchema_<Overwrite<STATE, { putDefault: unknown }>, ELEMENTS>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new SetSchema_(overwrite(this.state, { keyDefault: nextDefault as unknown }), this.elements),
      new SetSchema_(overwrite(this.state, { putDefault: nextDefault as unknown }), this.elements)
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
  ): SetSchema_<Overwrite<STATE, { keyLink: unknown }>, ELEMENTS> {
    return new SetSchema_(overwrite(this.state, { keyLink: nextKeyLink as unknown }), this.elements)
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (putItemInput: ValidValue<SCHEMA>) => ValidValue<this>
  ): SetSchema_<Overwrite<STATE, { putLink: unknown }>, ELEMENTS> {
    return new SetSchema_(overwrite(this.state, { putLink: nextPutLink as unknown }), this.elements)
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
  ): SetSchema_<Overwrite<STATE, { updateLink: unknown }>, ELEMENTS> {
    return new SetSchema_(
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
    SetSchema_<Overwrite<STATE, { keyLink: unknown }>, ELEMENTS>,
    SetSchema_<Overwrite<STATE, { putLink: unknown }>, ELEMENTS>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new SetSchema_(overwrite(this.state, { keyLink: nextLink as unknown }), this.elements),
      new SetSchema_(overwrite(this.state, { putLink: nextLink as unknown }), this.elements)
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<ValidValue<this, { mode: 'key'; defined: true }>, this>
  ): SetSchema_<Overwrite<STATE, { keyValidator: Validator }>, ELEMENTS> {
    return new SetSchema_(
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
  ): SetSchema_<Overwrite<STATE, { putValidator: Validator }>, ELEMENTS> {
    return new SetSchema_(
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
  ): SetSchema_<Overwrite<STATE, { updateValidator: Validator }>, ELEMENTS> {
    return new SetSchema_(
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
    SetSchema_<Overwrite<STATE, { keyValidator: Validator }>, ELEMENTS>,
    SetSchema_<Overwrite<STATE, { putValidator: Validator }>, ELEMENTS>
  > {
    return ifThenElse(
      /**
       * @debt type "remove this cast"
       */
      this.state.key as STATE['key'],
      new SetSchema_(
        overwrite(this.state, { keyValidator: nextValidator as Validator }),
        this.elements
      ),
      new SetSchema_(
        overwrite(this.state, { putValidator: nextValidator as Validator }),
        this.elements
      )
    )
  }

  clone<NEXT_STATE extends Partial<SharedAttributeState> = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): SetSchema_<Overwrite<STATE, NEXT_STATE>, ELEMENTS> {
    return new SetSchema_(overwrite(this.state, nextState), this.elements)
  }

  build<ACTION extends SchemaAction<this> = SchemaAction<this>>(
    Action: new (schema: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}
