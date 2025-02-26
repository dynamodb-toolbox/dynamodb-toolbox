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
import type { Validator } from '../types/validator.js'
import { MapSchema } from './schema.js'
import type { MapAttributesSchemas } from './types.js'

type MapAttributeTyper = <
  ATTRIBUTES extends MapAttributesSchemas,
  STATE extends SharedAttributeState = {}
>(
  attributes: NarrowObject<ATTRIBUTES>,
  state?: NarrowObject<STATE>
) => MapSchema_<STATE, ATTRIBUTES>

/**
 * Define a new map attribute
 *
 * @param attributes Dictionary of attributes
 * @param state _(optional)_ Map Options
 */
export const map: MapAttributeTyper = <
  ATTRIBUTES extends MapAttributesSchemas,
  STATE extends SharedAttributeState = {}
>(
  attributes: NarrowObject<ATTRIBUTES>,
  state: STATE = {} as STATE
): MapSchema_<STATE, ATTRIBUTES> => new MapSchema_(state, attributes)

/**
 * MapAttribute attribute interface
 */
export class MapSchema_<
  STATE extends SharedAttributeState = SharedAttributeState,
  ATTRIBUTES extends MapAttributesSchemas = MapAttributesSchemas
> extends MapSchema<STATE, ATTRIBUTES> {
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
  ): MapSchema_<Overwrite<STATE, { required: NEXT_IS_REQUIRED }>, ATTRIBUTES> {
    return new MapSchema_(overwrite(this.state, { required: nextRequired }), this.attributes)
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): MapSchema_<Overwrite<STATE, { required: Never }>, ATTRIBUTES> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): MapSchema_<Overwrite<STATE, { hidden: NEXT_HIDDEN }>, ATTRIBUTES> {
    return new MapSchema_(overwrite(this.state, { hidden: nextHidden }), this.attributes)
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): MapSchema_<Overwrite<STATE, { key: NEXT_KEY; required: Always }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.state, { key: nextKey, required: 'always' }),
      this.attributes
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): MapSchema_<Overwrite<STATE, { savedAs: NEXT_SAVED_AS }>, ATTRIBUTES> {
    return new MapSchema_(overwrite(this.state, { savedAs: nextSavedAs }), this.attributes)
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): MapSchema_<Overwrite<STATE, { keyDefault: unknown }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.state, { keyDefault: nextKeyDefault as unknown }),
      this.attributes
    )
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<this>>
  ): MapSchema_<Overwrite<STATE, { putDefault: unknown }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.state, { putDefault: nextPutDefault as unknown }),
      this.attributes
    )
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<AttributeUpdateItemInput<this, true>>
  ): MapSchema_<Overwrite<STATE, { updateDefault: unknown }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.state, { updateDefault: nextUpdateDefault as unknown }),
      this.attributes
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
    MapSchema_<Overwrite<STATE, { keyDefault: unknown }>, ATTRIBUTES>,
    MapSchema_<Overwrite<STATE, { putDefault: unknown }>, ATTRIBUTES>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new MapSchema_(
        overwrite(this.state, { keyDefault: nextDefault as unknown }),
        this.attributes
      ),
      new MapSchema_(overwrite(this.state, { putDefault: nextDefault as unknown }), this.attributes)
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
  ): MapSchema_<Overwrite<STATE, { keyLink: unknown }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.state, { keyLink: nextKeyLink as unknown }),
      this.attributes
    )
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (putItemInput: ValidValue<SCHEMA>) => ValidValue<this>
  ): MapSchema_<Overwrite<STATE, { putLink: unknown }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.state, { putLink: nextPutLink as unknown }),
      this.attributes
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
  ): MapSchema_<Overwrite<STATE, { updateLink: unknown }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.state, { updateLink: nextUpdateLink as unknown }),
      this.attributes
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
    MapSchema_<Overwrite<STATE, { keyLink: unknown }>, ATTRIBUTES>,
    MapSchema_<Overwrite<STATE, { putLink: unknown }>, ATTRIBUTES>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new MapSchema_(overwrite(this.state, { keyLink: nextLink as unknown }), this.attributes),
      new MapSchema_(overwrite(this.state, { putLink: nextLink as unknown }), this.attributes)
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<ValidValue<this, { mode: 'key'; defined: true }>, this>
  ): MapSchema_<Overwrite<STATE, { keyValidator: Validator }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.state, { keyValidator: nextKeyValidator as Validator }),
      this.attributes
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => boolean | string`
   */
  putValidate(
    nextPutValidator: Validator<ValidValue<this, { defined: true }>, this>
  ): MapSchema_<Overwrite<STATE, { putValidator: Validator }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.state, { putValidator: nextPutValidator as Validator }),
      this.attributes
    )
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => boolean | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<AttributeUpdateItemInput<this, true>, this>
  ): MapSchema_<Overwrite<STATE, { updateValidator: Validator }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.state, { updateValidator: nextUpdateValidator as Validator }),
      this.attributes
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
    MapSchema_<Overwrite<STATE, { keyValidator: Validator }>, ATTRIBUTES>,
    MapSchema_<Overwrite<STATE, { putValidator: Validator }>, ATTRIBUTES>
  > {
    return ifThenElse(
      this.state.key as STATE['key'],
      new MapSchema_(
        overwrite(this.state, { keyValidator: nextValidator as Validator }),
        this.attributes
      ),
      new MapSchema_(
        overwrite(this.state, { putValidator: nextValidator as Validator }),
        this.attributes
      )
    )
  }

  clone<NEXT_STATE extends Partial<SharedAttributeState> = {}>(
    nextState: NarrowObject<NEXT_STATE> = {} as NEXT_STATE
  ): MapSchema_<Overwrite<STATE, NEXT_STATE>, ATTRIBUTES> {
    return new MapSchema_(overwrite(this.state, nextState), this.attributes)
  }

  build<SCHEMA_ACTION extends SchemaAction<this> = SchemaAction<this>>(
    schemaAction: new (schema: this) => SCHEMA_ACTION
  ): SCHEMA_ACTION {
    return new schemaAction(this)
  }
}
