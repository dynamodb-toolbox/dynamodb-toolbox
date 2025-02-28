/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { UpdateValueInput } from '~/entity/actions/update/types.js'
import type { Paths, SchemaAction, ValidValue } from '~/schema/index.js'
import type { If, NarrowObject, Overwrite, ValueOrGetter } from '~/types/index.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'

import type { StringSchema } from '../string/index.js'
import type {
  Always,
  AtLeastOnce,
  Never,
  Schema,
  SchemaProps,
  SchemaRequiredProp,
  Validator
} from '../types/index.js'
import type { Light } from '../utils/light.js'
import { light } from '../utils/light.js'
import { RecordSchema } from './schema.js'
import type { RecordElementSchema, RecordKeySchema } from './types.js'

type RecordSchemer = <
  KEYS extends RecordKeySchema,
  ELEMENTS extends RecordElementSchema,
  PROPS extends SchemaProps = {}
>(
  keys: KEYS,
  elements: ELEMENTS,
  props?: NarrowObject<PROPS>
) => RecordSchema_<Light<KEYS>, Light<ELEMENTS>, PROPS>

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
 * @param props _(optional)_ Record Props
 */
export const record: RecordSchemer = <
  KEYS extends RecordKeySchema,
  ELEMENTS extends RecordElementSchema,
  PROPS extends SchemaProps = {}
>(
  keys: KEYS,
  elements: ELEMENTS,
  props: NarrowObject<PROPS> = {} as PROPS
) => new RecordSchema_(light(keys), light(elements), props)

/**
 * Record attribute interface
 */
export class RecordSchema_<
  KEYS extends StringSchema = StringSchema,
  ELEMENTS extends Schema = Schema,
  PROPS extends SchemaProps = SchemaProps
> extends RecordSchema<KEYS, ELEMENTS, PROPS> {
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
  ): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { required: NEXT_IS_REQUIRED }>> {
    return new RecordSchema_(
      this.keys,
      this.elements,
      overwrite(this.props, { required: nextRequired })
    )
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { hidden: NEXT_HIDDEN }>> {
    return new RecordSchema_(
      this.keys,
      this.elements,
      overwrite(this.props, { hidden: nextHidden })
    )
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { key: NEXT_KEY; required: Always }>> {
    return new RecordSchema_(
      this.keys,
      this.elements,
      overwrite(this.props, { key: nextKey, required: 'always' })
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { savedAs: NEXT_SAVED_AS }>> {
    return new RecordSchema_(
      this.keys,
      this.elements,
      overwrite(this.props, { savedAs: nextSavedAs })
    )
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { keyDefault: unknown }>> {
    return new RecordSchema_(
      this.keys,
      this.elements,
      overwrite(this.props, { keyDefault: nextKeyDefault as unknown })
    )
  }

  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `putAttributeInput | (() => putAttributeInput)`
   */
  putDefault(
    nextPutDefault: ValueOrGetter<ValidValue<this>>
  ): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { putDefault: unknown }>> {
    return new RecordSchema_(
      this.keys,
      this.elements,
      overwrite(this.props, { putDefault: nextPutDefault as unknown })
    )
  }

  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `updateAttributeInput | (() => updateAttributeInput)`
   */
  updateDefault(
    nextUpdateDefault: ValueOrGetter<UpdateValueInput<this, { filled: true }>>
  ): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { updateDefault: unknown }>> {
    return new RecordSchema_(
      this.keys,
      this.elements,
      overwrite(this.props, { updateDefault: nextUpdateDefault as unknown })
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
    RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { keyDefault: unknown }>>,
    RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { putDefault: unknown }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new RecordSchema_(
        this.keys,
        this.elements,
        overwrite(this.props, { keyDefault: nextDefault as unknown })
      ),
      new RecordSchema_(
        this.keys,
        this.elements,
        overwrite(this.props, { putDefault: nextDefault as unknown })
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
      keyInput: ValidValue<SCHEMA, { mode: 'key'; defined: true }>
    ) => ValidValue<this, { mode: 'key' }>
  ): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { keyLink: unknown }>> {
    return new RecordSchema_(
      this.keys,
      this.elements,
      overwrite(this.props, { keyLink: nextKeyLink as unknown })
    )
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (putItemInput: ValidValue<SCHEMA, { defined: true }>) => ValidValue<this>
  ): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { putLink: unknown }>> {
    return new RecordSchema_(
      this.keys,
      this.elements,
      overwrite(this.props, { putLink: nextPutLink as unknown })
    )
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
  ): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { updateLink: unknown }>> {
    return new RecordSchema_(
      this.keys,
      this.elements,
      overwrite(this.props, { updateLink: nextUpdateLink as unknown })
    )
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
    RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { keyLink: unknown }>>,
    RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { putLink: unknown }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new RecordSchema_(
        this.keys,
        this.elements,
        overwrite(this.props, { keyLink: nextLink as unknown })
      ),
      new RecordSchema_(
        this.keys,
        this.elements,
        overwrite(this.props, { putLink: nextLink as unknown })
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
  ): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { keyValidator: Validator }>> {
    return new RecordSchema_(
      this.keys,
      this.elements,
      overwrite(this.props, { keyValidator: nextKeyValidator as Validator })
    )
  }

  /**
   * Provide a custom validator for attribute in PUT commands
   *
   * @param nextPutValidator `(putAttributeInput) => boolean | string`
   */
  putValidate(
    nextPutValidator: Validator<ValidValue<this, { defined: true }>, this>
  ): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { putValidator: Validator }>> {
    return new RecordSchema_(
      this.keys,
      this.elements,
      overwrite(this.props, { putValidator: nextPutValidator as Validator })
    )
  }

  /**
   * Provide a custom validator for attribute in UPDATE commands
   *
   * @param nextUpdateValidator `(updateAttributeInput) => boolean | string`
   */
  updateValidate(
    nextUpdateValidator: Validator<UpdateValueInput<this, { filled: true }>, this>
  ): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { updateValidator: Validator }>> {
    return new RecordSchema_(
      this.keys,
      this.elements,
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
    RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { keyValidator: Validator }>>,
    RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, { putValidator: Validator }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new RecordSchema_(
        this.keys,
        this.elements,
        overwrite(this.props, { keyValidator: nextValidator as Validator })
      ),
      new RecordSchema_(
        this.keys,
        this.elements,
        overwrite(this.props, { putValidator: nextValidator as Validator })
      )
    )
  }

  clone<NEXT_PROPS extends SchemaProps = {}>(
    nextProps: NarrowObject<NEXT_PROPS> = {} as NEXT_PROPS
  ): RecordSchema_<KEYS, ELEMENTS, Overwrite<PROPS, NEXT_PROPS>> {
    return new RecordSchema_(this.keys, this.elements, overwrite(this.props, nextProps))
  }

  build<ACTION extends SchemaAction<this> = SchemaAction<this>>(
    Action: new (schema: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}
