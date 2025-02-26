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
import type { AttrSchema } from '../types/index.js'
import type { Validator } from '../types/validator.js'
import { ListSchema } from './schema.js'
import type { ListElementSchema } from './types.js'

type ListAttributeTyper = <$ELEMENTS extends ListElementSchema, PROPS extends SchemaProps = {}>(
  elements: $ELEMENTS,
  props?: NarrowObject<PROPS>
) => ListSchema_<PROPS, $ELEMENTS>

/**
 * Define a new list attribute
 * Note that list elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not renamed (savedAs: undefined)
 * - Not defaulted (defaults: undefined)
 *
 * @param elements Attribute (With constraints)
 * @param props _(optional)_ List Options
 */
export const list: ListAttributeTyper = <
  $ELEMENTS extends ListElementSchema,
  PROPS extends SchemaProps = {}
>(
  elements: $ELEMENTS,
  props: NarrowObject<PROPS> = {} as PROPS
): ListSchema_<PROPS, $ELEMENTS> => new ListSchema_(props, elements)

/**
 * List attribute interface
 */
export class ListSchema_<
  PROPS extends SchemaProps = SchemaProps,
  ELEMENTS extends AttrSchema = AttrSchema
> extends ListSchema<PROPS, ELEMENTS> {
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
  ): ListSchema_<Overwrite<PROPS, { required: NEXT_IS_REQUIRED }>, ELEMENTS> {
    return new ListSchema_(overwrite(this.props, { required: nextRequired }), this.elements)
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): ListSchema_<Overwrite<PROPS, { required: Never }>, ELEMENTS> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): ListSchema_<Overwrite<PROPS, { hidden: NEXT_HIDDEN }>, ELEMENTS> {
    return new ListSchema_(overwrite(this.props, { hidden: nextHidden }), this.elements)
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): ListSchema_<Overwrite<PROPS, { key: NEXT_KEY; required: Always }>, ELEMENTS> {
    return new ListSchema_(
      overwrite(this.props, { key: nextKey, required: 'always' }),
      this.elements
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): ListSchema_<Overwrite<PROPS, { savedAs: NEXT_SAVED_AS }>, ELEMENTS> {
    return new ListSchema_(overwrite(this.props, { savedAs: nextSavedAs }), this.elements)
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): ListSchema_<Overwrite<PROPS, { keyDefault: unknown }>, ELEMENTS> {
    return new ListSchema_(
      overwrite(this.props, { keyDefault: nextKeyDefault as unknown }),
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
  ): ListSchema_<Overwrite<PROPS, { putDefault: unknown }>, ELEMENTS> {
    return new ListSchema_(
      overwrite(this.props, { putDefault: nextPutDefault as unknown }),
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
  ): ListSchema_<Overwrite<PROPS, { updateDefault: unknown }>, ELEMENTS> {
    return new ListSchema_(
      overwrite(this.props, { updateDefault: nextUpdateDefault as unknown }),
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
    ListSchema_<Overwrite<PROPS, { keyDefault: unknown }>, ELEMENTS>,
    ListSchema_<Overwrite<PROPS, { putDefault: unknown }>, ELEMENTS>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new ListSchema_(overwrite(this.props, { keyDefault: nextDefault as unknown }), this.elements),
      new ListSchema_(overwrite(this.props, { putDefault: nextDefault as unknown }), this.elements)
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
  ): ListSchema_<Overwrite<PROPS, { keyLink: unknown }>, ELEMENTS> {
    return new ListSchema_(
      overwrite(this.props, { keyLink: nextKeyLink as unknown }),
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
  ): ListSchema_<Overwrite<PROPS, { putLink: unknown }>, ELEMENTS> {
    return new ListSchema_(
      overwrite(this.props, { putLink: nextPutLink as unknown }),
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
  ): ListSchema_<Overwrite<PROPS, { updateLink: unknown }>, ELEMENTS> {
    return new ListSchema_(
      overwrite(this.props, { updateLink: nextUpdateLink as unknown }),
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
    ListSchema_<Overwrite<PROPS, { keyLink: unknown }>, ELEMENTS>,
    ListSchema_<Overwrite<PROPS, { putLink: unknown }>, ELEMENTS>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new ListSchema_(overwrite(this.props, { keyLink: nextLink as unknown }), this.elements),
      new ListSchema_(overwrite(this.props, { putLink: nextLink as unknown }), this.elements)
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<ValidValue<this, { mode: 'key'; defined: true }>, this>
  ): ListSchema_<Overwrite<PROPS, { keyValidator: Validator }>, ELEMENTS> {
    return new ListSchema_(
      overwrite(this.props, { keyValidator: nextKeyValidator as Validator }),
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
  ): ListSchema_<Overwrite<PROPS, { putValidator: Validator }>, ELEMENTS> {
    return new ListSchema_(
      overwrite(this.props, { putValidator: nextPutValidator as Validator }),
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
  ): ListSchema_<Overwrite<PROPS, { updateValidator: Validator }>, ELEMENTS> {
    return new ListSchema_(
      overwrite(this.props, { updateValidator: nextUpdateValidator as Validator }),
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
    ListSchema_<Overwrite<PROPS, { keyValidator: Validator }>, ELEMENTS>,
    ListSchema_<Overwrite<PROPS, { putValidator: Validator }>, ELEMENTS>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new ListSchema_(
        overwrite(this.props, { keyValidator: nextValidator as Validator }),
        this.elements as ELEMENTS
      ),
      new ListSchema_(
        overwrite(this.props, { putValidator: nextValidator as Validator }),
        this.elements as ELEMENTS
      )
    )
  }

  clone<NEXT_PROPS extends SchemaProps = {}>(
    nextProps: NarrowObject<NEXT_PROPS> = {} as NEXT_PROPS
  ): ListSchema_<Overwrite<PROPS, NEXT_PROPS>, ELEMENTS> {
    return new ListSchema_(overwrite(this.props, nextProps), this.elements)
  }

  build<ACTION extends SchemaAction<this> = SchemaAction<this>>(
    Action: new (schema: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}
