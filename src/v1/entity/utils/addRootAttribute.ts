import { DynamoDBToolboxError } from 'v1/errors'
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
): WithRootAttribute<ITEM, ATTRIBUTE_NAME, ATTRIBUTE> => {
  if (attributeName in item.attributes) {
    throw new DynamoDBToolboxError('entity.reservedAttributeName', {
      message: `'${attributeName}' is a reserved attribute name.`,
      path: attributeName
    })
  }

  if (attribute.savedAs !== undefined && attribute.savedAs in item.savedAttributeNames) {
    throw new DynamoDBToolboxError('entity.reservedAttributeSavedAs', {
      message: `'${attribute.savedAs}' is a reserved attribute alias (savedAs).`,
      path: attributeName
    })
  }

  return {
    type: item.type,
    savedAttributeNames:
      attribute.savedAs !== undefined
        ? new Set([...item.savedAttributeNames, attribute.savedAs])
        : item.savedAttributeNames,
    keyAttributeNames: attribute.key
      ? new Set([...item.keyAttributeNames, attributeName])
      : item.keyAttributeNames,
    requiredAttributeNames: {
      ...item.requiredAttributeNames,
      [attribute.required]: new Set([
        ...item.requiredAttributeNames[attribute.required],
        attributeName
      ])
    },
    attributes: addProperty(item.attributes, attributeName, attribute)
  }
}
