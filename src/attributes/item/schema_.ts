import type { SchemaAction } from '~/schema/index.js'
import type { ResetLinks } from '~/schema/utils/resetLinks.js'
import { resetLinks } from '~/schema/utils/resetLinks.js'
import type { NarrowObject } from '~/types/index.js'

import type { Light, LightObj } from '../shared/light.js'
import { lightObj } from '../shared/light.js'
import { ItemSchema } from './schema.js'
import type { ItemAttributes } from './types.js'

type ItemSchemaTyper = <ATTRIBUTES extends ItemAttributes>(
  attributes: NarrowObject<ATTRIBUTES>
) => ItemSchema_<LightObj<ATTRIBUTES>>

/**
 * Define a new item schema
 *
 * @param attributes Dictionary of attributes
 */
export const item: ItemSchemaTyper = <ATTRIBUTES extends ItemAttributes>(
  attributes: NarrowObject<ATTRIBUTES>
) => new ItemSchema_(lightObj(attributes))

export class ItemSchema_<
  ATTRIBUTES extends ItemAttributes = ItemAttributes
> extends ItemSchema<ATTRIBUTES> {
  pick<ATTRIBUTE_NAMES extends (keyof ATTRIBUTES)[]>(
    ...attributeNames: ATTRIBUTE_NAMES
  ): ItemSchema_<{
    [KEY in ATTRIBUTE_NAMES[number]]: ResetLinks<ATTRIBUTES[KEY]>
  }> {
    const nextAttributes = {} as {
      [KEY in ATTRIBUTE_NAMES[number]]: ResetLinks<ATTRIBUTES[KEY]>
    }

    for (const attributeName of attributeNames) {
      if (!(attributeName in this.attributes)) {
        continue
      }

      nextAttributes[attributeName] = resetLinks(this.attributes[attributeName])
    }

    return new ItemSchema_(nextAttributes)
  }

  omit<ATTRIBUTE_NAMES extends (keyof ATTRIBUTES)[]>(
    ...attributeNames: ATTRIBUTE_NAMES
  ): ItemSchema_<{
    [KEY in Exclude<keyof ATTRIBUTES, ATTRIBUTE_NAMES[number]>]: ResetLinks<ATTRIBUTES[KEY]>
  }> {
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

    return new ItemSchema_(nextAttributes)
  }

  and<ADDITIONAL_ATTRIBUTES extends ItemAttributes = ItemAttributes>(
    additionalAttr:
      | NarrowObject<ADDITIONAL_ATTRIBUTES>
      | ((schema: this) => NarrowObject<ADDITIONAL_ATTRIBUTES>)
  ): ItemSchema_<{
    [KEY in keyof ATTRIBUTES | keyof ADDITIONAL_ATTRIBUTES]: KEY extends keyof ADDITIONAL_ATTRIBUTES
      ? Light<ADDITIONAL_ATTRIBUTES[KEY]>
      : KEY extends keyof ATTRIBUTES
        ? ATTRIBUTES[KEY]
        : never
  }> {
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
      }
    )
  }

  build<ACTION extends SchemaAction<this> = SchemaAction<this>>(
    Action: new (schema: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}
