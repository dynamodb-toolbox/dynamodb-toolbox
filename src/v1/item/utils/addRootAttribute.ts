import type { Item, Attribute } from 'v1/item'
import { addProperty } from 'v1/utils/addProperty'

export type WithRootAttribute<
  ITEM extends Item,
  ATTRIBUTE_NAME extends string,
  ATTRIBUTE extends Attribute
> = Item<Omit<ITEM['attributes'], ATTRIBUTE_NAME> & Record<ATTRIBUTE_NAME, ATTRIBUTE>>

export const addRootAttribute = <
  ITEM extends Item,
  ATTRIBUTE_NAME extends string,
  ATTRIBUTE extends Attribute
>(
  item: ITEM,
  attributeName: ATTRIBUTE_NAME,
  attribute: ATTRIBUTE
): WithRootAttribute<ITEM, ATTRIBUTE_NAME, ATTRIBUTE> => ({
  type: item.type,
  keyAttributesNames: attribute.key
    ? new Set([...item.keyAttributesNames, attributeName])
    : item.keyAttributesNames,
  requiredAttributesNames: {
    ...item.requiredAttributesNames,
    [attribute.required]: new Set([
      ...item.requiredAttributesNames[attribute.required],
      attributeName
    ])
  },
  attributes: addProperty(item.attributes, attributeName, attribute)
})
