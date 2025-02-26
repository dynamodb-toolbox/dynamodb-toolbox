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
import type { ResolveStringSchema, ResolvedStringSchema } from './resolve.js'
import { StringSchema } from './schema.js'
import type { StringSchemaProps } from './types.js'

type StringAttributeTyper = <OPTIONS extends Omit<StringSchemaProps, 'enum'> = {}>(
  options?: NarrowObject<OPTIONS>
) => StringSchema_<OPTIONS>

/**
 * Define a new attribute of string type
 *
 * @param options _(optional)_ Attribute Options
 */
export const string: StringAttributeTyper = <OPTIONS extends Omit<StringSchemaProps, 'enum'> = {}>(
  options: NarrowObject<OPTIONS> = {} as OPTIONS
) => new StringSchema_(options)

/**
 * String attribute (warm)
 */
export class StringSchema_<
  PROPS extends StringSchemaProps = StringSchemaProps
> extends StringSchema<PROPS> {
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
  ): StringSchema_<Overwrite<PROPS, { required: NEXT_IS_REQUIRED }>> {
    return new StringSchema_(overwrite(this.props, { required: nextRequired }))
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): StringSchema_<Overwrite<PROPS, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): StringSchema_<Overwrite<PROPS, { hidden: NEXT_HIDDEN }>> {
    return new StringSchema_(overwrite(this.props, { hidden: nextHidden }))
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): StringSchema_<Overwrite<PROPS, { key: NEXT_KEY; required: Always }>> {
    return new StringSchema_(overwrite(this.props, { key: nextKey, required: 'always' }))
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): StringSchema_<Overwrite<PROPS, { savedAs: NEXT_SAVED_AS }>> {
    return new StringSchema_(overwrite(this.props, { savedAs: nextSavedAs }))
  }

  /**
   * Provide a finite list of possible values for attribute
   * (For typing reasons, enums are only available as attribute methods, not as input options)
   *
   * @param enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum<const NEXT_ENUM extends readonly ResolveStringSchema<this>[]>(
    ...nextEnum: NEXT_ENUM
  ): StringSchema_<Overwrite<PROPS, { enum: Writable<NEXT_ENUM> }>> {
    return new StringSchema_(overwrite(this.props, { enum: writable(nextEnum) }))
  }

  /**
   * Shorthand for `enum(constantValue).default(constantValue)`
   *
   * @param constantValue Constant value
   * @example
   * string().const('foo')
   */
  const<CONSTANT extends ResolveStringSchema<this>>(
    constant: CONSTANT
  ): If<
    PROPS['key'],
    StringSchema_<Overwrite<PROPS, { enum: [CONSTANT]; keyDefault: unknown }>>,
    StringSchema_<Overwrite<PROPS, { enum: [CONSTANT]; putDefault: unknown }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new StringSchema_(
        overwrite(this.props, { enum: [constant] as [CONSTANT], keyDefault: constant as unknown })
      ),
      new StringSchema_(
        overwrite(this.props, { enum: [constant] as [CONSTANT], putDefault: constant as unknown })
      )
    )
  }

  /**
   * Transform the attribute value in PUT commands OR Primary Key computing if attribute is tagged as key
   */
  transform<TRANSFORMER extends Transformer<ResolvedStringSchema, ResolveStringSchema<this>>>(
    transform: TRANSFORMER
  ): StringSchema_<Overwrite<PROPS, { transform: TRANSFORMER }>> {
    return new StringSchema_(overwrite(this.props, { transform }))
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): StringSchema_<Overwrite<PROPS, { keyDefault: unknown }>> {
    return new StringSchema_(overwrite(this.props, { keyDefault: nextKeyDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<this>>
  ): StringSchema_<Overwrite<PROPS, { putDefault: unknown }>> {
    return new StringSchema_(overwrite(this.props, { putDefault: nextPutDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<AttributeUpdateItemInput<this, true>>
  ): StringSchema_<Overwrite<PROPS, { updateDefault: unknown }>> {
    return new StringSchema_(overwrite(this.props, { updateDefault: nextUpdateDefault as unknown }))
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
    StringSchema_<Overwrite<PROPS, { keyDefault: unknown }>>,
    StringSchema_<Overwrite<PROPS, { putDefault: unknown }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new StringSchema_(overwrite(this.props, { keyDefault: nextDefault as unknown })),
      new StringSchema_(overwrite(this.props, { putDefault: nextDefault as unknown }))
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
  ): StringSchema_<Overwrite<PROPS, { keyLink: unknown }>> {
    return new StringSchema_(overwrite(this.props, { keyLink: nextKeyLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (putItemInput: ValidValue<SCHEMA>) => ValidValue<this>
  ): StringSchema_<Overwrite<PROPS, { putLink: unknown }>> {
    return new StringSchema_(overwrite(this.props, { putLink: nextPutLink as unknown }))
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
  ): StringSchema_<Overwrite<PROPS, { updateLink: unknown }>> {
    return new StringSchema_(overwrite(this.props, { updateLink: nextUpdateLink as unknown }))
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
    StringSchema_<Overwrite<PROPS, { keyLink: unknown }>>,
    StringSchema_<Overwrite<PROPS, { putLink: unknown }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new StringSchema_(overwrite(this.props, { keyLink: nextLink as unknown })),
      new StringSchema_(overwrite(this.props, { putLink: nextLink as unknown }))
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<ValidValue<this, { mode: 'key'; defined: true }>, this>
  ): StringSchema_<Overwrite<PROPS, { keyValidator: Validator }>> {
    return new StringSchema_(overwrite(this.props, { keyValidator: nextKeyValidator as Validator }))
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => boolean | string`
   */
  putValidate(
    nextPutValidator: Validator<ValidValue<this, { defined: true }>, this>
  ): StringSchema_<Overwrite<PROPS, { putValidator: Validator }>> {
    return new StringSchema_(overwrite(this.props, { putValidator: nextPutValidator as Validator }))
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => boolean | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<AttributeUpdateItemInput<this, true>, this>
  ): StringSchema_<Overwrite<PROPS, { updateValidator: Validator }>> {
    return new StringSchema_(
      overwrite(this.props, { updateValidator: nextUpdateValidator as Validator })
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
    StringSchema_<Overwrite<PROPS, { keyValidator: Validator }>>,
    StringSchema_<Overwrite<PROPS, { putValidator: Validator }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new StringSchema_(overwrite(this.props, { keyValidator: nextValidator as Validator })),
      new StringSchema_(overwrite(this.props, { putValidator: nextValidator as Validator }))
    )
  }

  clone<NEXT_PROPS extends StringSchemaProps = {}>(
    nextprops: NarrowObject<NEXT_PROPS> = {} as NEXT_PROPS
  ): StringSchema_<Overwrite<PROPS, NEXT_PROPS>> {
    return new StringSchema_(overwrite(this.props, nextprops))
  }

  build<ACTION extends SchemaAction<this> = SchemaAction<this>>(
    Action: new (schema: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}
