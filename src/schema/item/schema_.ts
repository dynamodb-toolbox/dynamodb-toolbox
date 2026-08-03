import type { SchemaAction } from '~/schema/index.js'
import type { ResetLinks } from '~/schema/utils/resetLinks.js'
import { resetLinks } from '~/schema/utils/resetLinks.js'
import type { NarrowObject, Overwrite } from '~/types/index.js'
import { overwrite } from '~/utils/overwrite.js'

import type { Light, LightObj } from '../utils/light.js'
import { lightObj } from '../utils/light.js'
import { ItemSchema } from './schema.js'
import type { ItemAttributes, ItemSchemaProps } from './types.js'

type ItemSchemer = <ATTRIBUTES extends ItemAttributes>(
  attributes: NarrowObject<ATTRIBUTES>
) => ItemSchema_<LightObj<ATTRIBUTES>, {}>

/**
 * Define a new item schema
 *
 * @param attributes Dictionary of attributes
 */
export const item: ItemSchemer = <ATTRIBUTES extends ItemAttributes>(
  attributes: NarrowObject<ATTRIBUTES>
) => new ItemSchema_(lightObj(attributes))

export class ItemSchema_<
  ATTRIBUTES extends ItemAttributes = ItemAttributes,
  PROPS extends ItemSchemaProps = ItemSchemaProps
> extends ItemSchema<ATTRIBUTES, PROPS> {
  /**
   * Reject additional (undeclared) attributes when parsing input values
   */
  strict<NEXT_STRICT extends boolean = true>(
    nextStrict: NEXT_STRICT = true as NEXT_STRICT
  ): ItemSchema_<ATTRIBUTES, Overwrite<PROPS, { strict: NEXT_STRICT }>> {
    return new ItemSchema_(this.attributes, overwrite(this.props, { strict: nextStrict }))
  }

  pick<ATTRIBUTE_NAMES extends (keyof ATTRIBUTES)[]>(
    ...attributeNames: ATTRIBUTE_NAMES
  ): ItemSchema_<{ [KEY in ATTRIBUTE_NAMES[number]]: ResetLinks<ATTRIBUTES[KEY]> }, PROPS> {
    const nextAttributes = {} as {
      [KEY in ATTRIBUTE_NAMES[number]]: ResetLinks<ATTRIBUTES[KEY]>
    }

    for (const attributeName of attributeNames) {
      if (!(attributeName in this.attributes)) {
        continue
      }

      nextAttributes[attributeName] = resetLinks(this.attributes[attributeName])
    }

    return new ItemSchema_(nextAttributes, this.props)
  }

  omit<ATTRIBUTE_NAMES extends (keyof ATTRIBUTES)[]>(
    ...attributeNames: ATTRIBUTE_NAMES
  ): ItemSchema_<
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

    return new ItemSchema_(nextAttributes, this.props)
  }

  and<ADDITIONAL_ATTRIBUTES extends ItemAttributes = ItemAttributes>(
    additionalAttr:
      | NarrowObject<ADDITIONAL_ATTRIBUTES>
      | ((schema: this) => NarrowObject<ADDITIONAL_ATTRIBUTES>)
  ): ItemSchema_<
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
    ) as ItemAttributes

    const nextAttributes = { ...this.attributes } as ItemAttributes

    for (const [attributeName, additionalAttribute] of Object.entries(additionalAttributes)) {
      nextAttributes[attributeName] = additionalAttribute
    }

    return new ItemSchema_(
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

  build<ACTION extends SchemaAction<this> = SchemaAction<this>>(
    Action: new (schema: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}
