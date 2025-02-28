/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { AttributeUpdateItemInput } from '~/entity/actions/update/types.js'
import type { Paths, SchemaAction, ValidValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/index.js'
import type { If, NarrowObject, Overwrite, ValueOrGetter } from '~/types/index.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'

import type {
  Always,
  AtLeastOnce,
  Never,
  Schema,
  SchemaRequiredProp,
  Validator
} from '../types/index.js'
import type { ResolveAnySchema } from './resolve.js'
import { AnySchema } from './schema.js'
import type { AnySchemaProps } from './types.js'

type AnySchemer = <PROPS extends Omit<AnySchemaProps, 'castAs'> = {}>(
  props?: NarrowObject<PROPS>
) => AnySchema_<PROPS>

/**
 * Define a new schema of any type
 *
 * @param props _(optional)_ Attribute Props
 */
export const any: AnySchemer = <PROPS extends Omit<AnySchemaProps, 'castAs'> = {}>(
  props: NarrowObject<PROPS> = {} as PROPS
) => new AnySchema_(props)

/**
 * Any attribute (warm)
 */
export class AnySchema_<PROPS extends AnySchemaProps = AnySchemaProps> extends AnySchema<PROPS> {
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
  ): AnySchema_<Overwrite<PROPS, { required: NEXT_IS_REQUIRED }>> {
    return new AnySchema_(overwrite(this.props, { required: nextRequired }))
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): AnySchema_<Overwrite<PROPS, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): AnySchema_<Overwrite<PROPS, { hidden: NEXT_HIDDEN }>> {
    return new AnySchema_(overwrite(this.props, { hidden: nextHidden }))
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): AnySchema_<Overwrite<PROPS, { key: NEXT_KEY; required: Always }>> {
    return new AnySchema_(overwrite(this.props, { key: nextKey, required: 'always' }))
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): AnySchema_<Overwrite<PROPS, { savedAs: NEXT_SAVED_AS }>> {
    return new AnySchema_(overwrite(this.props, { savedAs: nextSavedAs }))
  }

  /**
   * Cast attribute TS type
   */
  castAs<NEXT_CAST_AS>(
    nextCastAs = undefined as unknown as NEXT_CAST_AS
  ): AnySchema_<Overwrite<PROPS, { castAs: NEXT_CAST_AS }>> {
    return new AnySchema_(overwrite(this.props, { castAs: nextCastAs }))
  }

  /**
   * Transform the attribute value in PUT commands OR Primary Key computing if attribute is tagged as key
   */
  transform<TRANSFORMER extends Transformer<unknown, ResolveAnySchema<this>>>(
    transform: TRANSFORMER
  ): AnySchema_<Overwrite<PROPS, { transform: TRANSFORMER }>> {
    return new AnySchema_(overwrite(this.props, { transform }))
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): AnySchema_<Overwrite<PROPS, { keyDefault: unknown }>> {
    return new AnySchema_(overwrite(this.props, { keyDefault: nextKeyDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<this>>
  ): AnySchema_<Overwrite<PROPS, { putDefault: unknown }>> {
    return new AnySchema_(overwrite(this.props, { putDefault: nextPutDefault as unknown }))
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<AttributeUpdateItemInput<this, true>>
  ): AnySchema_<Overwrite<PROPS, { updateDefault: unknown }>> {
    return new AnySchema_(overwrite(this.props, { updateDefault: nextUpdateDefault as unknown }))
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
    AnySchema_<Overwrite<PROPS, { keyDefault: unknown }>>,
    AnySchema_<Overwrite<PROPS, { putDefault: unknown }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new AnySchema_(overwrite(this.props, { keyDefault: nextDefault as unknown })),
      new AnySchema_(overwrite(this.props, { putDefault: nextDefault as unknown }))
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
  ): AnySchema_<Overwrite<PROPS, { keyLink: unknown }>> {
    return new AnySchema_(overwrite(this.props, { keyLink: nextKeyLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (putItemInput: ValidValue<SCHEMA, { defined: true }>) => ValidValue<this>
  ): AnySchema_<Overwrite<PROPS, { putLink: unknown }>> {
    return new AnySchema_(overwrite(this.props, { putLink: nextPutLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in UPDATE commands
   *
   * @param nextUpdateLink `unknown | ((updateItemInput) => updateAttributeInput)`
   */
  updateLink<SCHEMA extends Schema>(
    nextUpdateLink: (
      updateItemInput: AttributeUpdateItemInput<SCHEMA, true, Paths<SCHEMA>>
    ) => AttributeUpdateItemInput<this, true>
  ): AnySchema_<Overwrite<PROPS, { updateLink: unknown }>> {
    return new AnySchema_(overwrite(this.props, { updateLink: nextUpdateLink as unknown }))
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
    AnySchema_<Overwrite<PROPS, { keyLink: unknown }>>,
    AnySchema_<Overwrite<PROPS, { putLink: unknown }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new AnySchema_(overwrite(this.props, { keyLink: nextLink as unknown })),
      new AnySchema_(overwrite(this.props, { putLink: nextLink as unknown }))
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<ValidValue<this, { mode: 'key'; defined: true }>, this>
  ): AnySchema_<Overwrite<PROPS, { keyValidator: Validator }>> {
    return new AnySchema_(overwrite(this.props, { keyValidator: nextKeyValidator as Validator }))
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => boolean | string`
   */
  putValidate(
    nextPutValidator: Validator<ValidValue<this, { defined: true }>, this>
  ): AnySchema_<Overwrite<PROPS, { putValidator: Validator }>> {
    return new AnySchema_(overwrite(this.props, { putValidator: nextPutValidator as Validator }))
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => boolean | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<AttributeUpdateItemInput<this, true>, this>
  ): AnySchema_<Overwrite<PROPS, { updateValidator: Validator }>> {
    return new AnySchema_(
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
    AnySchema_<Overwrite<PROPS, { keyValidator: Validator }>>,
    AnySchema_<Overwrite<PROPS, { putValidator: Validator }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new AnySchema_(overwrite(this.props, { keyValidator: nextValidator as Validator })),
      new AnySchema_(overwrite(this.props, { putValidator: nextValidator as Validator }))
    )
  }

  clone<NEXT_PROPS extends AnySchemaProps = {}>(
    nextProps: NarrowObject<NEXT_PROPS> = {} as NEXT_PROPS
  ): AnySchema_<Overwrite<PROPS, NEXT_PROPS>> {
    return new AnySchema_(overwrite(this.props, nextProps))
  }

  build<ACTION extends SchemaAction<this> = SchemaAction<this>>(
    Action: new (schema: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}
