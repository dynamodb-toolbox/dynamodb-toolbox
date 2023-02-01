import { $MapAttributeAttributes, MapAttributeAttributes, RequiredOption } from './attributes'
import { FreezeAttribute } from './attributes/freeze'
import { $type, $attributes, $open } from './attributes/constants/attributeOptions'

/**
 * Entity items shape
 *
 * @param MapAttributeAttributesInput Object of attributes
 * @return Item
 */
export interface $Item<
  $MAP_ATTRIBUTE_ATTRIBUTES extends $MapAttributeAttributes = $MapAttributeAttributes
> {
  [$type]: 'item'
  [$open]: boolean
  [$attributes]: $MAP_ATTRIBUTE_ATTRIBUTES
}

export interface Item<
  MAP_ATTRIBUTE_ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes
> {
  type: 'item'
  open: boolean
  keyAttributesNames: Set<string>
  requiredAttributesNames: Record<RequiredOption, Set<string>>
  attributes: MAP_ATTRIBUTE_ATTRIBUTES
}

export type FreezeItem<$ITEM extends $Item> = $Item extends $ITEM
  ? Item
  : Item<
      {
        [KEY in keyof $ITEM[$attributes]]: FreezeAttribute<$ITEM[$attributes][KEY]>
      }
    >
