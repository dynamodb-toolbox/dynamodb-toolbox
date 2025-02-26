/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { AttributeUpdateItemInput, UpdateItemInput } from '~/entity/actions/update/types.js'
import type { Schema, SchemaAction, ValidValue } from '~/schema/index.js'
import type { If, NarrowObject, Overwrite, ValueOrGetter } from '~/types/index.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'

import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/index.js'
import type { SchemaProps } from '../shared/props.js'
import type { StringSchema } from '../string/index.js'
import type { AttrSchema } from '../types/index.js'
import type { Validator } from '../types/validator.js'
import { RecordSchema } from './schema.js'
import type { RecordElementSchema, RecordKeySchema } from './types.js'

type RecordAttributeTyper = <
  KEYS extends RecordKeySchema,
  ELEMENTS extends RecordElementSchema,
  PROPS extends SchemaProps = {}
>(
  keys: KEYS,
  elements: ELEMENTS,
  props?: NarrowObject<PROPS>
) => RecordSchema_<PROPS, KEYS, ELEMENTS>

/**
 * Define a new record attribute
 * Note that record keys and elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not key (key: false)
 * - Not renamed (savedAs: undefined)
 * - Not defaulted (defaults: undefined)
 *
 * @param keys Keys (With constraints)
 * @param elements Attribute (With constraints)
 * @param props _(optional)_ Record Options
 */
export const record: RecordAttributeTyper = <
  KEYS extends RecordKeySchema,
  ELEMENTS extends RecordElementSchema,
  PROPS extends SchemaProps = {}
>(
  keys: KEYS,
  elements: ELEMENTS,
  props: NarrowObject<PROPS> = {} as PROPS
) => new RecordSchema_(props, keys, elements)

/**
 * Record attribute interface
 */
export class RecordSchema_<
  PROPS extends SchemaProps = SchemaProps,
  KEYS extends StringSchema = StringSchema,
  ELEMENTS extends AttrSchema = AttrSchema
> extends RecordSchema<PROPS, KEYS, ELEMENTS> {
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
  ): RecordSchema_<Overwrite<PROPS, { required: NEXT_IS_REQUIRED }>, KEYS, ELEMENTS> {
    return new RecordSchema_(
      overwrite(this.props, { required: nextRequired }),
      this.keys,
      this.elements
    )
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): RecordSchema_<Overwrite<PROPS, { required: Never }>, KEYS, ELEMENTS> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): RecordSchema_<Overwrite<PROPS, { hidden: NEXT_HIDDEN }>, KEYS, ELEMENTS> {
    return new RecordSchema_(
      overwrite(this.props, { hidden: nextHidden }),
      this.keys,
      this.elements
    )
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): RecordSchema_<Overwrite<PROPS, { key: NEXT_KEY; required: Always }>, KEYS, ELEMENTS> {
    return new RecordSchema_(
      overwrite(this.props, { key: nextKey, required: 'always' }),
      this.keys,
      this.elements
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): RecordSchema_<Overwrite<PROPS, { savedAs: NEXT_SAVED_AS }>, KEYS, ELEMENTS> {
    return new RecordSchema_(
      overwrite(this.props, { savedAs: nextSavedAs }),
      this.keys,
      this.elements
    )
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): RecordSchema_<Overwrite<PROPS, { keyDefault: unknown }>, KEYS, ELEMENTS> {
    return new RecordSchema_(
      overwrite(this.props, { keyDefault: nextKeyDefault as unknown }),
      this.keys,
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
  ): RecordSchema_<Overwrite<PROPS, { putDefault: unknown }>, KEYS, ELEMENTS> {
    return new RecordSchema_(
      overwrite(this.props, { putDefault: nextPutDefault as unknown }),
      this.keys,
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
  ): RecordSchema_<Overwrite<PROPS, { updateDefault: unknown }>, KEYS, ELEMENTS> {
    return new RecordSchema_(
      overwrite(this.props, { updateDefault: nextUpdateDefault as unknown }),
      this.keys,
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
      If<PROPS['key'], ValidValue<this, { mode: 'key' }>, ValidValue<this>>
    >
  ): If<
    PROPS['key'],
    RecordSchema_<Overwrite<PROPS, { keyDefault: unknown }>, KEYS, ELEMENTS>,
    RecordSchema_<Overwrite<PROPS, { putDefault: unknown }>, KEYS, ELEMENTS>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new RecordSchema_(
        overwrite(this.props, { keyDefault: nextDefault as unknown }),
        this.keys,
        this.elements
      ),
      new RecordSchema_(
        overwrite(this.props, { putDefault: nextDefault as unknown }),
        this.keys,
        this.elements
      )
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
  ): RecordSchema_<Overwrite<PROPS, { keyLink: unknown }>, KEYS, ELEMENTS> {
    return new RecordSchema_(
      overwrite(this.props, { keyLink: nextKeyLink as unknown }),
      this.keys,
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
  ): RecordSchema_<Overwrite<PROPS, { putLink: unknown }>, KEYS, ELEMENTS> {
    return new RecordSchema_(
      overwrite(this.props, { putLink: nextPutLink as unknown }),
      this.keys,
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
  ): RecordSchema_<Overwrite<PROPS, { updateLink: unknown }>, KEYS, ELEMENTS> {
    return new RecordSchema_(
      overwrite(this.props, { updateLink: nextUpdateLink as unknown }),
      this.keys,
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
      keyOrPutItemInput: If<PROPS['key'], ValidValue<SCHEMA, { mode: 'key' }>, ValidValue<SCHEMA>>
    ) => If<PROPS['key'], ValidValue<this, { mode: 'key' }>, ValidValue<this>>
  ): If<
    PROPS['key'],
    RecordSchema_<Overwrite<PROPS, { keyLink: unknown }>, KEYS, ELEMENTS>,
    RecordSchema_<Overwrite<PROPS, { putLink: unknown }>, KEYS, ELEMENTS>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new RecordSchema_(
        overwrite(this.props, { keyLink: nextLink as unknown }),
        this.keys,
        this.elements
      ),
      new RecordSchema_(
        overwrite(this.props, { putLink: nextLink as unknown }),
        this.keys,
        this.elements
      )
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<ValidValue<this, { mode: 'key'; defined: true }>, this>
  ): RecordSchema_<Overwrite<PROPS, { keyValidator: Validator }>, KEYS, ELEMENTS> {
    return new RecordSchema_(
      overwrite(this.props, { keyValidator: nextKeyValidator as Validator }),
      this.keys,
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
  ): RecordSchema_<Overwrite<PROPS, { putValidator: Validator }>, KEYS, ELEMENTS> {
    return new RecordSchema_(
      overwrite(this.props, { putValidator: nextPutValidator as Validator }),
      this.keys,
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
  ): RecordSchema_<Overwrite<PROPS, { updateValidator: Validator }>, KEYS, ELEMENTS> {
    return new RecordSchema_(
      overwrite(this.props, { updateValidator: nextUpdateValidator as Validator }),
      this.keys,
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
        PROPS['key'],
        ValidValue<this, { mode: 'key'; defined: true }>,
        ValidValue<this, { defined: true }>
      >,
      this
    >
  ): If<
    PROPS['key'],
    RecordSchema_<Overwrite<PROPS, { keyValidator: Validator }>, KEYS, ELEMENTS>,
    RecordSchema_<Overwrite<PROPS, { putValidator: Validator }>, KEYS, ELEMENTS>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new RecordSchema_(
        overwrite(this.props, { keyValidator: nextValidator as Validator }),
        this.keys,
        this.elements
      ),
      new RecordSchema_(
        overwrite(this.props, { putValidator: nextValidator as Validator }),
        this.keys,
        this.elements
      )
    )
  }

  clone<NEXT_PROPS extends SchemaProps = {}>(
    nextProps: NarrowObject<NEXT_PROPS> = {} as NEXT_PROPS
  ): RecordSchema_<Overwrite<PROPS, NEXT_PROPS>, KEYS, ELEMENTS> {
    return new RecordSchema_(overwrite(this.props, nextProps), this.keys, this.elements)
  }

  build<ACTION extends SchemaAction<this> = SchemaAction<this>>(
    Action: new (schema: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}
