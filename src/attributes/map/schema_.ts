/**
 * @debt circular "Remove & prevent imports from entity to schema"
 */
import type { AttributeUpdateItemInput } from '~/entity/actions/update/types.js'
import type { Paths, SchemaAction, ValidValue } from '~/schema/index.js'
import type { ResetLinks } from '~/schema/utils/resetLinks.js'
import { resetLinks } from '~/schema/utils/resetLinks.js'
import type { If, NarrowObject, Overwrite, ValueOrGetter } from '~/types/index.js'
import { ifThenElse } from '~/utils/ifThenElse.js'
import { overwrite } from '~/utils/overwrite.js'

import type { Always, AtLeastOnce, Never, RequiredOption } from '../constants/index.js'
import type { Light, LightObj } from '../shared/light.js'
import { lightObj } from '../shared/light.js'
import type { SchemaProps } from '../shared/props.js'
import type { AttrSchema } from '../types/attrSchema.js'
import type { Validator } from '../types/validator.js'
import { MapSchema } from './schema.js'
import type { MapAttributes } from './types.js'

type MapSchemer = <ATTRIBUTES extends MapAttributes, PROPS extends SchemaProps = {}>(
  attributes: NarrowObject<ATTRIBUTES>,
  props?: NarrowObject<PROPS>
) => MapSchema_<PROPS, LightObj<ATTRIBUTES>>

/**
 * Define a new map attribute
 *
 * @param attributes Dictionary of attributes
 * @param props _(optional)_ Map Options
 */
export const map: MapSchemer = <ATTRIBUTES extends MapAttributes, PROPS extends SchemaProps = {}>(
  attributes: NarrowObject<ATTRIBUTES>,
  props: PROPS = {} as PROPS
) => new MapSchema_(props, lightObj(attributes))

/**
 * Map schema
 */
export class MapSchema_<
  PROPS extends SchemaProps = SchemaProps,
  ATTRIBUTES extends MapAttributes = MapAttributes
> extends MapSchema<PROPS, ATTRIBUTES> {
  /**
   * Tag schema values as required. Possible values are:
   * - `'atLeastOnce'` _(default)_: Required in PUTs, optional in UPDATEs
   * - `'never'`: Optional in PUTs and UPDATEs
   * - `'always'`: Required in PUTs and UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required<NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
  ): MapSchema_<Overwrite<PROPS, { required: NEXT_IS_REQUIRED }>, ATTRIBUTES> {
    return new MapSchema_(overwrite(this.props, { required: nextRequired }), this.attributes)
  }

  /**
   * Shorthand for `required('never')`
   */
  optional(): MapSchema_<Overwrite<PROPS, { required: Never }>, ATTRIBUTES> {
    return this.required('never')
  }

  /**
   * Hide schema values after fetch commands and formatting
   */
  hidden<NEXT_HIDDEN extends boolean = true>(
    nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN
  ): MapSchema_<Overwrite<PROPS, { hidden: NEXT_HIDDEN }>, ATTRIBUTES> {
    return new MapSchema_(overwrite(this.props, { hidden: nextHidden }), this.attributes)
  }

  /**
   * Tag schema values as a primary key attribute or linked to a primary key attribute
   */
  key<NEXT_KEY extends boolean = true>(
    nextKey: NEXT_KEY = true as NEXT_KEY
  ): MapSchema_<Overwrite<PROPS, { key: NEXT_KEY; required: Always }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.props, { key: nextKey, required: 'always' }),
      this.attributes
    )
  }

  /**
   * Rename schema values before save commands
   */
  savedAs<NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ): MapSchema_<Overwrite<PROPS, { savedAs: NEXT_SAVED_AS }>, ATTRIBUTES> {
    return new MapSchema_(overwrite(this.props, { savedAs: nextSavedAs }), this.attributes)
  }

  /**
   * Provide a default value during Primary Key computing
   *
   * @param nextKeyDefault `keyInput | (() => keyInput)`
   */
  keyDefault(
    nextKeyDefault: ValueOrGetter<ValidValue<this, { mode: 'key' }>>
  ): MapSchema_<Overwrite<PROPS, { keyDefault: unknown }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.props, { keyDefault: nextKeyDefault as unknown }),
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
  ): MapSchema_<Overwrite<PROPS, { putDefault: unknown }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.props, { putDefault: nextPutDefault as unknown }),
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
  ): MapSchema_<Overwrite<PROPS, { updateDefault: unknown }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.props, { updateDefault: nextUpdateDefault as unknown }),
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
      If<PROPS['key'], ValidValue<this, { mode: 'key' }>, ValidValue<this>>
    >
  ): If<
    PROPS['key'],
    MapSchema_<Overwrite<PROPS, { keyDefault: unknown }>, ATTRIBUTES>,
    MapSchema_<Overwrite<PROPS, { putDefault: unknown }>, ATTRIBUTES>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new MapSchema_(
        overwrite(this.props, { keyDefault: nextDefault as unknown }),
        this.attributes
      ),
      new MapSchema_(overwrite(this.props, { putDefault: nextDefault as unknown }), this.attributes)
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
  ): MapSchema_<Overwrite<PROPS, { keyLink: unknown }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.props, { keyLink: nextKeyLink as unknown }),
      this.attributes
    )
  }

  /**
   * Provide a **linked** default value for attribute in PUT commands
   *
   * @param nextPutLink `putAttributeInput | ((putItemInput) => putAttributeInput)`
   */
  putLink<SCHEMA extends AttrSchema>(
    nextPutLink: (putItemInput: ValidValue<SCHEMA, { defined: true }>) => ValidValue<this>
  ): MapSchema_<Overwrite<PROPS, { putLink: unknown }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.props, { putLink: nextPutLink as unknown }),
      this.attributes
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
  ): MapSchema_<Overwrite<PROPS, { updateLink: unknown }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.props, { updateLink: nextUpdateLink as unknown }),
      this.attributes
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
    MapSchema_<Overwrite<PROPS, { keyLink: unknown }>, ATTRIBUTES>,
    MapSchema_<Overwrite<PROPS, { putLink: unknown }>, ATTRIBUTES>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new MapSchema_(overwrite(this.props, { keyLink: nextLink as unknown }), this.attributes),
      new MapSchema_(overwrite(this.props, { putLink: nextLink as unknown }), this.attributes)
    )
  }

  /**
   * Provide a custom validator for attribute in Primary Key computing
   *
   * @param nextKeyValidator `(keyAttributeInput) => boolean | string`
   */
  keyValidate(
    nextKeyValidator: Validator<ValidValue<this, { mode: 'key'; defined: true }>, this>
  ): MapSchema_<Overwrite<PROPS, { keyValidator: Validator }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.props, { keyValidator: nextKeyValidator as Validator }),
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
  ): MapSchema_<Overwrite<PROPS, { putValidator: Validator }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.props, { putValidator: nextPutValidator as Validator }),
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
  ): MapSchema_<Overwrite<PROPS, { updateValidator: Validator }>, ATTRIBUTES> {
    return new MapSchema_(
      overwrite(this.props, { updateValidator: nextUpdateValidator as Validator }),
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
        PROPS['key'],
        ValidValue<this, { mode: 'key'; defined: true }>,
        ValidValue<this, { defined: true }>
      >,
      this
    >
  ): If<
    PROPS['key'],
    MapSchema_<Overwrite<PROPS, { keyValidator: Validator }>, ATTRIBUTES>,
    MapSchema_<Overwrite<PROPS, { putValidator: Validator }>, ATTRIBUTES>
  > {
    return ifThenElse(
      this.props.key as PROPS['key'],
      new MapSchema_(
        overwrite(this.props, { keyValidator: nextValidator as Validator }),
        this.attributes
      ),
      new MapSchema_(
        overwrite(this.props, { putValidator: nextValidator as Validator }),
        this.attributes
      )
    )
  }

  pick<ATTRIBUTE_NAMES extends (keyof ATTRIBUTES)[]>(
    ...attributeNames: ATTRIBUTE_NAMES
  ): MapSchema_<PROPS, { [KEY in ATTRIBUTE_NAMES[number]]: ResetLinks<ATTRIBUTES[KEY]> }> {
    const nextAttributes = {} as {
      [KEY in ATTRIBUTE_NAMES[number]]: ResetLinks<ATTRIBUTES[KEY]>
    }

    for (const attributeName of attributeNames) {
      if (!(attributeName in this.attributes)) {
        continue
      }

      nextAttributes[attributeName] = resetLinks(this.attributes[attributeName])
    }

    return new MapSchema_(this.props, nextAttributes)
  }

  omit<ATTRIBUTE_NAMES extends (keyof ATTRIBUTES)[]>(
    ...attributeNames: ATTRIBUTE_NAMES
  ): MapSchema_<
    PROPS,
    { [KEY in Exclude<keyof ATTRIBUTES, ATTRIBUTE_NAMES[number]>]: ResetLinks<ATTRIBUTES[KEY]> }
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

    return new MapSchema_(this.props, nextAttributes)
  }

  and<ADDITIONAL_ATTRIBUTES extends MapAttributes = MapAttributes>(
    additionalAttr:
      | NarrowObject<ADDITIONAL_ATTRIBUTES>
      | ((schema: this) => NarrowObject<ADDITIONAL_ATTRIBUTES>)
  ): MapSchema_<
    PROPS,
    {
      [KEY in
        | keyof ATTRIBUTES
        | keyof ADDITIONAL_ATTRIBUTES]: KEY extends keyof ADDITIONAL_ATTRIBUTES
        ? Light<ADDITIONAL_ATTRIBUTES[KEY]>
        : KEY extends keyof ATTRIBUTES
          ? ATTRIBUTES[KEY]
          : never
    }
  > {
    const additionalAttributes = (
      typeof additionalAttr === 'function' ? additionalAttr(this) : additionalAttr
    ) as MapAttributes

    const nextAttributes = { ...this.attributes } as MapAttributes

    for (const [attributeName, additionalAttribute] of Object.entries(additionalAttributes)) {
      nextAttributes[attributeName] = additionalAttribute
    }

    return new MapSchema_(
      this.props,
      nextAttributes as {
        [KEY in
          | keyof ATTRIBUTES
          | keyof ADDITIONAL_ATTRIBUTES]: KEY extends keyof ADDITIONAL_ATTRIBUTES
          ? Light<ADDITIONAL_ATTRIBUTES[KEY]>
          : KEY extends keyof ATTRIBUTES
            ? ATTRIBUTES[KEY]
            : never
      }
    )
  }

  clone<NEXT_PROPS extends SchemaProps = {}>(
    nextProps: NarrowObject<NEXT_PROPS> = {} as NEXT_PROPS
  ): MapSchema_<Overwrite<PROPS, NEXT_PROPS>, ATTRIBUTES> {
    return new MapSchema_(overwrite(this.props, nextProps), this.attributes)
  }

  build<ACTION extends SchemaAction<this> = SchemaAction<this>>(
    Action: new (schema: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}
