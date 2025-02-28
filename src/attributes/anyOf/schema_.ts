/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { AttributeUpdateItemInput } from '~/entity/actions/update/types.js'
import type { Paths, SchemaAction, ValidValue } from '~/schema/index.js'
import type { If, NarrowObject, Overwrite, ValueOrGetter } from '~/types/index.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'

import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/index.js'
import type { LightTuple } from '../shared/light.js'
import { lightTuple } from '../shared/light.js'
import type { SchemaProps } from '../shared/props.js'
import type { AttrSchema } from '../types/attrSchema.js'
import type { Validator } from '../types/validator.js'
import { AnyOfSchema } from './schema.js'
import type { AnyOfElementSchema } from './types.js'

type AnyOfAttributeTyper = <ELEMENTS extends AnyOfElementSchema[]>(
  ...elements: ELEMENTS
) => AnyOfSchema_<{}, LightTuple<ELEMENTS>>

/**
 * Define a new anyOf attribute
 * @param elements Attribute[]
 */
export const anyOf: AnyOfAttributeTyper = (...elements) =>
  new AnyOfSchema_({}, lightTuple(...elements))

/**
 * AnyOf attribute interface
 */
export class AnyOfSchema_<
  PROPS extends SchemaProps = SchemaProps,
  ELEMENTS extends AttrSchema[] = AttrSchema[]
> extends AnyOfSchema<PROPS, ELEMENTS> {
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
  ): AnyOfSchema_<Overwrite<PROPS, { required: NEXT_IS_REQUIRED }>, ELEMENTS> {
    return new AnyOfSchema_(overwrite(this.props, { required: nextRequired }), this.elements)
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): AnyOfSchema_<Overwrite<PROPS, { required: Never }>, ELEMENTS> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): AnyOfSchema_<Overwrite<PROPS, { hidden: NEXT_HIDDEN }>, ELEMENTS> {
    return new AnyOfSchema_(overwrite(this.props, { hidden: nextHidden }), this.elements)
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): AnyOfSchema_<Overwrite<PROPS, { key: NEXT_KEY; required: Always }>, ELEMENTS> {
    return new AnyOfSchema_(
      overwrite(this.props, { key: nextKey, required: 'always' }),
      this.elements
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): AnyOfSchema_<Overwrite<PROPS, { savedAs: NEXT_SAVED_AS }>, ELEMENTS> {
    return new AnyOfSchema_(overwrite(this.props, { savedAs: nextSavedAs }), this.elements)
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): AnyOfSchema_<Overwrite<PROPS, { keyDefault: unknown }>, ELEMENTS> {
    return new AnyOfSchema_(
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
  ): AnyOfSchema_<Overwrite<PROPS, { putDefault: unknown }>, ELEMENTS> {
    return new AnyOfSchema_(
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
  ): AnyOfSchema_<Overwrite<PROPS, { updateDefault: unknown }>, ELEMENTS> {
    return new AnyOfSchema_(
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
    AnyOfSchema_<Overwrite<PROPS, { keyDefault: unknown }>, ELEMENTS>,
    AnyOfSchema_<Overwrite<PROPS, { putDefault: unknown }>, ELEMENTS>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new AnyOfSchema_(
        overwrite(this.props, { keyDefault: nextDefault as unknown }),
        this.elements
      ),
      new AnyOfSchema_(overwrite(this.props, { putDefault: nextDefault as unknown }), this.elements)
    )
  }

  /**
   * Provide a **linked** default value for attribute in Primary Key computing
   *
   * @param nextKeyLink `keyAttributeInput | ((keyInput) => keyAttributeInput)`
   */
  keyLink<SCHEMA extends AttrSchema>(
    nextKeyLink: (
      keyInput: ValidValue<SCHEMA, { mode: 'key'; defined: true }>
    ) => ValidValue<this, { mode: 'key' }>
  ): AnyOfSchema_<Overwrite<PROPS, { keyLink: unknown }>, ELEMENTS> {
    return new AnyOfSchema_(
      overwrite(this.props, { keyLink: nextKeyLink as unknown }),
      this.elements
    )
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends AttrSchema>(
    nextPutLink: (putItemInput: ValidValue<SCHEMA, { defined: true }>) => ValidValue<this>
  ): AnyOfSchema_<Overwrite<PROPS, { putLink: unknown }>, ELEMENTS> {
    return new AnyOfSchema_(
      overwrite(this.props, { putLink: nextPutLink as unknown }),
      this.elements
    )
  }

  /**
   * Provide a **linked** default value for attribute in UPDATE commands
   *
   * @param nextUpdateLink `unknown | ((updateItemInput) => updateAttributeInput)`
   */
  updateLink<SCHEMA extends AttrSchema>(
    nextUpdateLink: (
      updateItemInput: AttributeUpdateItemInput<SCHEMA, true, Paths<SCHEMA>>
    ) => AttributeUpdateItemInput<this, true>
  ): AnyOfSchema_<Overwrite<PROPS, { updateLink: unknown }>, ELEMENTS> {
    return new AnyOfSchema_(
      overwrite(this.props, { updateLink: nextUpdateLink as unknown }),
      this.elements
    )
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextLink `key/putAttributeInput | (() => key/putAttributeInput)`
   */
  link<SCHEMA extends AttrSchema>(
    nextLink: (
      keyOrPutItemInput: If<
        PROPS['key'],
        ValidValue<SCHEMA, { mode: 'key'; defined: true }>,
        ValidValue<SCHEMA, { defined: true }>
      >
    ) => If<PROPS['key'], ValidValue<this, { mode: 'key' }>, ValidValue<this>>
  ): If<
    PROPS['key'],
    AnyOfSchema_<Overwrite<PROPS, { keyLink: unknown }>, ELEMENTS>,
    AnyOfSchema_<Overwrite<PROPS, { putLink: unknown }>, ELEMENTS>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new AnyOfSchema_(overwrite(this.props, { keyLink: nextLink as unknown }), this.elements),
      new AnyOfSchema_(overwrite(this.props, { putLink: nextLink as unknown }), this.elements)
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<ValidValue<this, { mode: 'key'; defined: true }>, this>
  ): AnyOfSchema_<Overwrite<PROPS, { keyValidator: Validator }>, ELEMENTS> {
    return new AnyOfSchema_(
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
  ): AnyOfSchema_<Overwrite<PROPS, { putValidator: Validator }>, ELEMENTS> {
    return new AnyOfSchema_(
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
  ): AnyOfSchema_<Overwrite<PROPS, { updateValidator: Validator }>, ELEMENTS> {
    return new AnyOfSchema_(
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
    AnyOfSchema_<Overwrite<PROPS, { keyValidator: Validator }>, ELEMENTS>,
    AnyOfSchema_<Overwrite<PROPS, { putValidator: Validator }>, ELEMENTS>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new AnyOfSchema_(
        overwrite(this.props, { keyValidator: nextValidator as Validator }),
        this.elements
      ),
      new AnyOfSchema_(
        overwrite(this.props, { putValidator: nextValidator as Validator }),
        this.elements
      )
    )
  }

  clone<NEXT_PROPS extends SchemaProps = {}>(
    nextprops: NarrowObject<NEXT_PROPS> = {} as NEXT_PROPS
  ): AnyOfSchema_<Overwrite<PROPS, NEXT_PROPS>, ELEMENTS> {
    return new AnyOfSchema_(overwrite(this.props, nextprops), this.elements)
  }

  build<ACTION extends SchemaAction<this> = SchemaAction<this>>(
    Action: new (schema: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}
