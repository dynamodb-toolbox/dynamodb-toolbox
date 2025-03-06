/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { UpdateValueInput } from '~/entity/actions/update/types.js'
import type { Paths, SchemaAction, ValidValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/index.js'
import type { If, NarrowObject, Overwrite, ValueOrGetter, Writable } from '~/types/index.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'
import { writable } from '~/utils/writable.js'

import type {
  Always,
  AtLeastOnce,
  Never,
  Schema,
  SchemaProps,
  SchemaRequiredProp,
  Validator
} from '../types/index.js'
import type { ResolvedNullSchema } from './resolve.js'
import { NullSchema } from './schema.js'
import type { NullSchemaProps } from './types.js'

type NullSchemer = <PROPS extends Omit<SchemaProps, 'enum'> = {}>(
  props?: NarrowObject<PROPS>
) => NullSchema_<PROPS>

/**
 * Define a new schema of null type
 *
 * @param props _(optional)_ Schema Props
 */
export const nul: NullSchemer = <PROPS extends SchemaProps = {}>(
  props: NarrowObject<PROPS> = {} as PROPS
) => new NullSchema_(props)

/**
 * Null attribute (warm)
 */
export class NullSchema_<
  PROPS extends NullSchemaProps = NullSchemaProps
> extends NullSchema<PROPS> {
  /**
   * Tag attribute as required. Possible values are:
   * - `'atLeastOnce'` _(default)_: Required in PUTs, optional in UPDATEs
   * - `'never'`: Optional in PUTs and UPDATEs
   * - `'always'`: Required in PUTs and UPDATEs
   *
   * @param nextRequired SchemaRequiredProp
   */
  required<NEXT_IS_REQUIRED extends SchemaRequiredProp = AtLeastOnce>(
    nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
  ): NullSchema_<Overwrite<PROPS, { required: NEXT_IS_REQUIRED }>> {
    return new NullSchema_(overwrite(this.props, { required: nextRequired }))
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): NullSchema_<Overwrite<PROPS, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): NullSchema_<Overwrite<PROPS, { hidden: NEXT_HIDDEN }>> {
    return new NullSchema_(overwrite(this.props, { hidden: nextHidden }))
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): NullSchema_<Overwrite<PROPS, { key: NEXT_KEY; required: Always }>> {
    return new NullSchema_(overwrite(this.props, { key: nextKey, required: 'always' }))
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): NullSchema_<Overwrite<PROPS, { savedAs: NEXT_SAVED_AS }>> {
    return new NullSchema_(overwrite(this.props, { savedAs: nextSavedAs }))
  }

  /**
   * Provide a finite list of possible values for attribute
   * (For typing reasons, enums are only available as attribute methods, not as input props)
   *
   * @param enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum<const NEXT_ENUM extends readonly ResolvedNullSchema[]>(
    ...nextEnum: NEXT_ENUM
  ): NullSchema_<Overwrite<PROPS, { enum: Writable<NEXT_ENUM> }>> {
    return new NullSchema_(overwrite(this.props, { enum: writable(nextEnum) }))
  }

  /**
   * Shorthand for `enum(constantValue).default(constantValue)`
   *
   * @param constantValue Constant value
   * @example
   * string().const('foo')
   */
  const<CONSTANT extends ResolvedNullSchema>(
    constant: CONSTANT
  ): If<
    PROPS['key'],
    NullSchema_<Overwrite<PROPS, { enum: [CONSTANT]; keyDefault: unknown }>>,
    NullSchema_<Overwrite<PROPS, { enum: [CONSTANT]; putDefault: unknown }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new NullSchema_(
        overwrite(this.props, { enum: [constant] as [CONSTANT], keyDefault: constant as unknown })
      ),
      new NullSchema_(
        overwrite(this.props, { enum: [constant] as [CONSTANT], putDefault: constant as unknown })
      )
    )
  }

  /**
   * Transform the attribute value in PUT commands OR Primary Key computing if attribute is tagged as key
   */
  transform<TRANSFORMER extends Transformer<ResolvedNullSchema>>(
    transform: TRANSFORMER
  ): NullSchema_<Overwrite<PROPS, { transform: TRANSFORMER }>> {
    return new NullSchema_(overwrite(this.props, { transform }))
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): NullSchema_<Overwrite<PROPS, { keyDefault: unknown }>> {
    return new NullSchema_(overwrite(this.props, { keyDefault: nextKeyDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<this>>
  ): NullSchema_<Overwrite<PROPS, { putDefault: unknown }>> {
    return new NullSchema_(overwrite(this.props, { putDefault: nextPutDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<UpdateValueInput<this, { filled: true }>>
  ): NullSchema_<Overwrite<PROPS, { updateDefault: unknown }>> {
    return new NullSchema_(overwrite(this.props, { updateDefault: nextUpdateDefault as unknown }))
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
    NullSchema_<Overwrite<PROPS, { keyDefault: unknown }>>,
    NullSchema_<Overwrite<PROPS, { putDefault: unknown }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new NullSchema_(overwrite(this.props, { keyDefault: nextDefault as unknown })),
      new NullSchema_(overwrite(this.props, { putDefault: nextDefault as unknown }))
    )
  }

  /**
   * Provide a **linked** default value for attribute in Primary Key computing
   *
   * @param nextKeyLink `keyAttributeInput | ((keyInput) => keyAttributeInput)`
   */
  keyLink<SCHEMA extends Schema>(
    nextKeyLink: (
      keyInput: ValidValue<SCHEMA, { mode: 'key'; defined: true }>
    ) => ValidValue<this, { mode: 'key' }>
  ): NullSchema_<Overwrite<PROPS, { keyLink: unknown }>> {
    return new NullSchema_(overwrite(this.props, { keyLink: nextKeyLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (putItemInput: ValidValue<SCHEMA, { defined: true }>) => ValidValue<this>
  ): NullSchema_<Overwrite<PROPS, { putLink: unknown }>> {
    return new NullSchema_(overwrite(this.props, { putLink: nextPutLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in UPDATE commands
   *
   * @param nextUpdateLink `unknown | ((updateItemInput) => updateAttributeInput)`
   */
  updateLink<SCHEMA extends Schema>(
    nextUpdateLink: (
      updateItemInput: UpdateValueInput<SCHEMA, { defined: true; extended: false }, Paths<SCHEMA>>
    ) => UpdateValueInput<this, { filled: true }>
  ): NullSchema_<Overwrite<PROPS, { updateLink: unknown }>> {
    return new NullSchema_(overwrite(this.props, { updateLink: nextUpdateLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands OR Primary Key computing if attribute is tagged as key
   *
   * @param nextLink `key/putAttributeInput | (() => key/putAttributeInput)`
   */
  link<SCHEMA extends Schema>(
    nextLink: (
      keyOrPutItemInput: If<
        PROPS['key'],
        ValidValue<SCHEMA, { mode: 'key'; defined: true }>,
        ValidValue<SCHEMA, { defined: true }>
      >
    ) => If<PROPS['key'], ValidValue<this, { mode: 'key' }>, ValidValue<this>>
  ): If<
    PROPS['key'],
    NullSchema_<Overwrite<PROPS, { keyLink: unknown }>>,
    NullSchema_<Overwrite<PROPS, { putLink: unknown }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new NullSchema_(overwrite(this.props, { keyLink: nextLink as unknown })),
      new NullSchema_(overwrite(this.props, { putLink: nextLink as unknown }))
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => null | string`
   */
  keyValidate(
    nextKeyValidator: Validator<ValidValue<this, { mode: 'key'; defined: true }>, this>
  ): NullSchema_<Overwrite<PROPS, { keyValidator: Validator }>> {
    return new NullSchema_(overwrite(this.props, { keyValidator: nextKeyValidator as Validator }))
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => null | string`
   */
  putValidate(
    nextPutValidator: Validator<ValidValue<this, { defined: true }>, this>
  ): NullSchema_<Overwrite<PROPS, { putValidator: Validator }>> {
    return new NullSchema_(overwrite(this.props, { putValidator: nextPutValidator as Validator }))
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => null | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<UpdateValueInput<this, { filled: true }>, this>
  ): NullSchema_<Overwrite<PROPS, { updateValidator: Validator }>> {
    return new NullSchema_(
      overwrite(this.props, { updateValidator: nextUpdateValidator as Validator })
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
        PROPS['key'],
        ValidValue<this, { mode: 'key'; defined: true }>,
        ValidValue<this, { defined: true }>
      >,
      this
    >
  ): If<
    PROPS['key'],
    NullSchema_<Overwrite<PROPS, { keyValidator: Validator }>>,
    NullSchema_<Overwrite<PROPS, { putValidator: Validator }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new NullSchema_(overwrite(this.props, { keyValidator: nextValidator as Validator })),
      new NullSchema_(overwrite(this.props, { putValidator: nextValidator as Validator }))
    )
  }

  clone<NEXT_PROPS extends NullSchemaProps = {}>(
    nextProps: NarrowObject<NEXT_PROPS> = {} as NEXT_PROPS
  ): NullSchema_<Overwrite<PROPS, NEXT_PROPS>> {
    return new NullSchema_(overwrite(this.props, nextProps))
  }

  build<ACTION extends SchemaAction<this> = SchemaAction<this>>(
    Action: new (schema: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}
