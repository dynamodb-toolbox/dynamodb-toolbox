/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { UpdateValueInput } from '~/entity/actions/update/types.js'
import type { Paths, SchemaAction, ValidValue } from '~/schema/index.js'
import type { If, NarrowObject, Overwrite, ValueOrGetter } from '~/types/index.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'

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
import { SetSchema } from './schema.js'
import type { SetElementSchema } from './types.js'

type SetSchemer = <ELEMENTS extends SetElementSchema, PROPS extends SchemaProps = {}>(
  elements: ELEMENTS,
  props?: NarrowObject<PROPS>
) => SetSchema_<Light<ELEMENTS>, PROPS>

/**
 * Define a new set attribute
 * Note that set elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not renamed (savedAs: undefined)
 * - Not defaulted (defaults: undefined)
 *
 * @param elements Attribute (With constraints)
 * @param props _(optional)_ List Props
 */
export const set: SetSchemer = <ELEMENTS extends SetElementSchema, PROPS extends SchemaProps = {}>(
  elements: ELEMENTS,
  props: NarrowObject<PROPS> = {} as PROPS
) => new SetSchema_(light(elements), props)

/**
 * Set attribute interface
 */
export class SetSchema_<
  ELEMENTS extends SetElementSchema = SetElementSchema,
  PROPS extends SchemaProps = SchemaProps
> extends SetSchema<ELEMENTS, PROPS> {
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
  ): SetSchema_<ELEMENTS, Overwrite<PROPS, { required: NEXT_IS_REQUIRED }>> {
    return new SetSchema_(this.elements, overwrite(this.props, { required: nextRequired }))
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): SetSchema_<ELEMENTS, Overwrite<PROPS, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): SetSchema_<ELEMENTS, Overwrite<PROPS, { hidden: NEXT_HIDDEN }>> {
    return new SetSchema_(this.elements, overwrite(this.props, { hidden: nextHidden }))
  }

  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): SetSchema_<ELEMENTS, Overwrite<PROPS, { key: NEXT_KEY; required: Always }>> {
    return new SetSchema_(
      this.elements,
      overwrite(this.props, { key: nextKey, required: 'always' })
    )
  }

  /**
   * Rename attribute before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): SetSchema_<ELEMENTS, Overwrite<PROPS, { savedAs: NEXT_SAVED_AS }>> {
    return new SetSchema_(this.elements, overwrite(this.props, { savedAs: nextSavedAs }))
  }

  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `keyAttributeInput | (() => keyAttributeInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): SetSchema_<ELEMENTS, Overwrite<PROPS, { keyDefault: unknown }>> {
    return new SetSchema_(
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
  ): SetSchema_<ELEMENTS, Overwrite<PROPS, { putDefault: unknown }>> {
    return new SetSchema_(
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
  ): SetSchema_<ELEMENTS, Overwrite<PROPS, { updateDefault: unknown }>> {
    return new SetSchema_(
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
    SetSchema_<ELEMENTS, Overwrite<PROPS, { keyDefault: unknown }>>,
    SetSchema_<ELEMENTS, Overwrite<PROPS, { putDefault: unknown }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new SetSchema_(this.elements, overwrite(this.props, { keyDefault: nextDefault as unknown })),
      new SetSchema_(this.elements, overwrite(this.props, { putDefault: nextDefault as unknown }))
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
  ): SetSchema_<ELEMENTS, Overwrite<PROPS, { keyLink: unknown }>> {
    return new SetSchema_(this.elements, overwrite(this.props, { keyLink: nextKeyLink as unknown }))
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends Schema>(
    nextPutLink: (putItemInput: ValidValue<SCHEMA, { defined: true }>) => ValidValue<this>
  ): SetSchema_<ELEMENTS, Overwrite<PROPS, { putLink: unknown }>> {
    return new SetSchema_(this.elements, overwrite(this.props, { putLink: nextPutLink as unknown }))
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
  ): SetSchema_<ELEMENTS, Overwrite<PROPS, { updateLink: unknown }>> {
    return new SetSchema_(
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
    SetSchema_<ELEMENTS, Overwrite<PROPS, { keyLink: unknown }>>,
    SetSchema_<ELEMENTS, Overwrite<PROPS, { putLink: unknown }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new SetSchema_(this.elements, overwrite(this.props, { keyLink: nextLink as unknown })),
      new SetSchema_(this.elements, overwrite(this.props, { putLink: nextLink as unknown }))
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<ValidValue<this, { mode: 'key'; defined: true }>, this>
  ): SetSchema_<ELEMENTS, Overwrite<PROPS, { keyValidator: Validator }>> {
    return new SetSchema_(
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
  ): SetSchema_<ELEMENTS, Overwrite<PROPS, { putValidator: Validator }>> {
    return new SetSchema_(
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
  ): SetSchema_<ELEMENTS, Overwrite<PROPS, { updateValidator: Validator }>> {
    return new SetSchema_(
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
    SetSchema_<ELEMENTS, Overwrite<PROPS, { keyValidator: Validator }>>,
    SetSchema_<ELEMENTS, Overwrite<PROPS, { putValidator: Validator }>>
  > {
    return ifThenElse(
      /**
       * @debt type "remove this cast"
       */
      this.props.key as PROPS['key'],
      new SetSchema_(
        this.elements,
        overwrite(this.props, { keyValidator: nextValidator as Validator })
      ),
      new SetSchema_(
        this.elements,
        overwrite(this.props, { putValidator: nextValidator as Validator })
      )
    )
  }

  clone<NEXT_PROPS extends SchemaProps = {}>(
    nextProps: NarrowObject<NEXT_PROPS> = {} as NEXT_PROPS
  ): SetSchema_<ELEMENTS, Overwrite<PROPS, NEXT_PROPS>> {
    return new SetSchema_(this.elements, overwrite(this.props, nextProps))
  }

  build<ACTION extends SchemaAction<this> = SchemaAction<this>>(
    Action: new (schema: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}
