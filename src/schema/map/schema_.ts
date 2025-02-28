/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { UpdateValueInput } from '~/entity/actions/update/types.js'
import type { Paths, SchemaAction, ValidValue } from '~/schema/index.js'
import type { ResetLinks } from '~/schema/utils/resetLinks.js'
import { resetLinks } from '~/schema/utils/resetLinks.js'
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
import type { Light, LightObj } from '../utils/light.js'
import { lightObj } from '../utils/light.js'
import { MapSchema } from './schema.js'
import type { MapAttributes } from './types.js'

type MapSchemer = <ATTRIBUTES extends MapAttributes, PROPS extends SchemaProps = {}>(
  attributes: NarrowObject<ATTRIBUTES>,
  props?: NarrowObject<PROPS>
) => MapSchema_<LightObj<ATTRIBUTES>, PROPS>

/**
 * Define a new map attribute
 *
 * @param attributes Dictionary of attributes
 * @param props _(optional)_ Map Props
 */
export const map: MapSchemer = <ATTRIBUTES extends MapAttributes, PROPS extends SchemaProps = {}>(
  attributes: NarrowObject<ATTRIBUTES>,
  props: PROPS = {} as PROPS
) => new MapSchema_(lightObj(attributes), props)

/**
 * Map schema
 */
export class MapSchema_<
  ATTRIBUTES extends MapAttributes = MapAttributes,
  PROPS extends SchemaProps = SchemaProps
> extends MapSchema<ATTRIBUTES, PROPS> {
  /**
   * Tag schema values as required. Possible values are:
   * - `'atLeastOnce'` _(default)_: Required in PUTs, optional in UPDATEs
   * - `'never'`: Optional in PUTs and UPDATEs
   * - `'always'`: Required in PUTs and UPDATEs
   *
   * @param nextRequired SchemaRequiredProp
   */
  required<NEXT_IS_REQUIRED extends SchemaRequiredProp = AtLeastOnce>(
    nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
  ): MapSchema_<ATTRIBUTES, Overwrite<PROPS, { required: NEXT_IS_REQUIRED }>> {
    return new MapSchema_(this.attributes, overwrite(this.props, { required: nextRequired }))
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): MapSchema_<ATTRIBUTES, Overwrite<PROPS, { required: Never }>> {
    return this.required('never')
  }

  /**
   * Hide schema values after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): MapSchema_<ATTRIBUTES, Overwrite<PROPS, { hidden: NEXT_HIDDEN }>> {
    return new MapSchema_(this.attributes, overwrite(this.props, { hidden: nextHidden }))
  }

  /**
   * Tag schema values as a primary key attribute or linked to a primary key attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): MapSchema_<ATTRIBUTES, Overwrite<PROPS, { key: NEXT_KEY; required: Always }>> {
    return new MapSchema_(
      this.attributes,
      overwrite(this.props, { key: nextKey, required: 'always' })
    )
  }

  /**
   * Rename schema values before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): MapSchema_<ATTRIBUTES, Overwrite<PROPS, { savedAs: NEXT_SAVED_AS }>> {
    return new MapSchema_(this.attributes, overwrite(this.props, { savedAs: nextSavedAs }))
  }

  /**
   * Provide a default value during Primary Key computing
   *
   * @param nextKeyDefault `keyInput | (() => keyInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): MapSchema_<ATTRIBUTES, Overwrite<PROPS, { keyDefault: unknown }>> {
    return new MapSchema_(
      this.attributes,
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
  ): MapSchema_<ATTRIBUTES, Overwrite<PROPS, { putDefault: unknown }>> {
    return new MapSchema_(
      this.attributes,
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
  ): MapSchema_<ATTRIBUTES, Overwrite<PROPS, { updateDefault: unknown }>> {
    return new MapSchema_(
      this.attributes,
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
    MapSchema_<ATTRIBUTES, Overwrite<PROPS, { keyDefault: unknown }>>,
    MapSchema_<ATTRIBUTES, Overwrite<PROPS, { putDefault: unknown }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new MapSchema_(
        this.attributes,
        overwrite(this.props, { keyDefault: nextDefault as unknown })
      ),
      new MapSchema_(this.attributes, overwrite(this.props, { putDefault: nextDefault as unknown }))
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
  ): MapSchema_<ATTRIBUTES, Overwrite<PROPS, { keyLink: unknown }>> {
    return new MapSchema_(
      this.attributes,
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
  ): MapSchema_<ATTRIBUTES, Overwrite<PROPS, { putLink: unknown }>> {
    return new MapSchema_(
      this.attributes,
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
  ): MapSchema_<ATTRIBUTES, Overwrite<PROPS, { updateLink: unknown }>> {
    return new MapSchema_(
      this.attributes,
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
    MapSchema_<ATTRIBUTES, Overwrite<PROPS, { keyLink: unknown }>>,
    MapSchema_<ATTRIBUTES, Overwrite<PROPS, { putLink: unknown }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new MapSchema_(this.attributes, overwrite(this.props, { keyLink: nextLink as unknown })),
      new MapSchema_(this.attributes, overwrite(this.props, { putLink: nextLink as unknown }))
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<ValidValue<this, { mode: 'key'; defined: true }>, this>
  ): MapSchema_<ATTRIBUTES, Overwrite<PROPS, { keyValidator: Validator }>> {
    return new MapSchema_(
      this.attributes,
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
  ): MapSchema_<ATTRIBUTES, Overwrite<PROPS, { putValidator: Validator }>> {
    return new MapSchema_(
      this.attributes,
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
  ): MapSchema_<ATTRIBUTES, Overwrite<PROPS, { updateValidator: Validator }>> {
    return new MapSchema_(
      this.attributes,
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
    MapSchema_<ATTRIBUTES, Overwrite<PROPS, { keyValidator: Validator }>>,
    MapSchema_<ATTRIBUTES, Overwrite<PROPS, { putValidator: Validator }>>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new MapSchema_(
        this.attributes,
        overwrite(this.props, { keyValidator: nextValidator as Validator })
      ),
      new MapSchema_(
        this.attributes,
        overwrite(this.props, { putValidator: nextValidator as Validator })
      )
    )
  }

  pick<ATTRIBUTE_NAMES extends (keyof ATTRIBUTES)[]>(
    ...attributeNames: ATTRIBUTE_NAMES
  ): MapSchema_<{ [KEY in ATTRIBUTE_NAMES[number]]: ResetLinks<ATTRIBUTES[KEY]> }, PROPS> {
    const nextAttributes = {} as {
      [KEY in ATTRIBUTE_NAMES[number]]: ResetLinks<ATTRIBUTES[KEY]>
    }

    for (const attributeName of attributeNames) {
      if (!(attributeName in this.attributes)) {
        continue
      }

      nextAttributes[attributeName] = resetLinks(this.attributes[attributeName])
    }

    return new MapSchema_(nextAttributes, this.props)
  }

  omit<ATTRIBUTE_NAMES extends (keyof ATTRIBUTES)[]>(
    ...attributeNames: ATTRIBUTE_NAMES
  ): MapSchema_<
    { [KEY in Exclude<keyof ATTRIBUTES, ATTRIBUTE_NAMES[number]>]: ResetLinks<ATTRIBUTES[KEY]> },
    PROPS
  > {
    const nextAttributes = {} as {
      [KEY in Exclude<keyof ATTRIBUTES, ATTRIBUTE_NAMES[number]>]: ResetLinks<ATTRIBUTES[KEY]>
    }

    const attributeNamesSet = new Set(attributeNames)
    for (const _attributeName of Object.keys(this.attributes) as (keyof ATTRIBUTES)[]) {
      if (attributeNamesSet.has(_attributeName)) {
        continue
      }

      const attributeName = _attributeName as Exclude<keyof ATTRIBUTES, ATTRIBUTE_NAMES[number]>
      nextAttributes[attributeName] = resetLinks(this.attributes[attributeName])
    }

    return new MapSchema_(nextAttributes, this.props)
  }

  and<ADDITIONAL_ATTRIBUTES extends MapAttributes = MapAttributes>(
    additionalAttr:
      | NarrowObject<ADDITIONAL_ATTRIBUTES>
      | ((schema: this) => NarrowObject<ADDITIONAL_ATTRIBUTES>)
  ): MapSchema_<
    {
      [KEY in
        | keyof ATTRIBUTES
        | keyof ADDITIONAL_ATTRIBUTES]: KEY extends keyof ADDITIONAL_ATTRIBUTES
        ? Light<ADDITIONAL_ATTRIBUTES[KEY]>
        : KEY extends keyof ATTRIBUTES
          ? ATTRIBUTES[KEY]
          : never
    },
    PROPS
  > {
    const additionalAttributes = (
      typeof additionalAttr === 'function' ? additionalAttr(this) : additionalAttr
    ) as MapAttributes

    const nextAttributes = { ...this.attributes } as MapAttributes

    for (const [attributeName, additionalAttribute] of Object.entries(additionalAttributes)) {
      nextAttributes[attributeName] = additionalAttribute
    }

    return new MapSchema_(
      nextAttributes as {
        [KEY in
          | keyof ATTRIBUTES
          | keyof ADDITIONAL_ATTRIBUTES]: KEY extends keyof ADDITIONAL_ATTRIBUTES
          ? Light<ADDITIONAL_ATTRIBUTES[KEY]>
          : KEY extends keyof ATTRIBUTES
            ? ATTRIBUTES[KEY]
            : never
      },
      this.props
    )
  }

  clone<NEXT_PROPS extends SchemaProps = {}>(
    nextProps: NarrowObject<NEXT_PROPS> = {} as NEXT_PROPS
  ): MapSchema_<ATTRIBUTES, Overwrite<PROPS, NEXT_PROPS>> {
    return new MapSchema_(this.attributes, overwrite(this.props, nextProps))
  }

  build<ACTION extends SchemaAction<this> = SchemaAction<this>>(
    Action: new (schema: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}
