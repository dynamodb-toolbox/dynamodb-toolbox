import type { $MapAttributeAttributes, MapAttributeAttributes, Narrow } from './attributes'
import { $key, $savedAs, $required } from './attributes/constants/attributeOptions'
import { DynamoDBToolboxError } from 'v1/errors'

import type { Item } from './interface'
import type { RequiredOption } from './attributes/constants/requiredOptions'
import { FreezeAttribute, freezeAttribute } from './attributes/freeze'

type ItemTyper = <$MAP_ATTRIBUTE_ATTRIBUTES extends $MapAttributeAttributes = {}>(
  attributes: Narrow<$MAP_ATTRIBUTE_ATTRIBUTES>
) => Item<
  { [KEY in keyof $MAP_ATTRIBUTE_ATTRIBUTES]: FreezeAttribute<$MAP_ATTRIBUTE_ATTRIBUTES[KEY]> }
>

/**
 * Defines an Entity items shape
 *
 * @param $attributes Object of attributes
 * @return Item
 */
export const item: ItemTyper = <$MAP_ATTRIBUTE_ATTRIBUTES extends $MapAttributeAttributes = {}>(
  $itemAttr: Narrow<$MAP_ATTRIBUTE_ATTRIBUTES>
): Item<
  { [KEY in keyof $MAP_ATTRIBUTE_ATTRIBUTES]: FreezeAttribute<$MAP_ATTRIBUTE_ATTRIBUTES[KEY]> }
> => {
  const $itemAttributes = $itemAttr as $MapAttributeAttributes

  const itemAttributes: MapAttributeAttributes = {}
  const savedAttributeNames = new Set<string>()
  const keyAttributeNames = new Set<string>()
  const requiredAttributeNames: Record<RequiredOption, Set<string>> = {
    always: new Set(),
    atLeastOnce: new Set(),
    onlyOnce: new Set(),
    never: new Set()
  }

  for (const attributeName in $itemAttributes) {
    const attribute = $itemAttributes[attributeName]

    const attributeSavedAs = attribute[$savedAs] ?? attributeName
    if (savedAttributeNames.has(attributeSavedAs)) {
      throw new DynamoDBToolboxError('item.duplicateSavedAsAttributes', {
        message: `Invalid item: More than two attributes are saved as '${attributeSavedAs}'`,
        payload: { savedAs: attributeSavedAs }
      })
    }
    savedAttributeNames.add(attributeSavedAs)

    if (attribute[$key]) {
      keyAttributeNames.add(attributeName)
    }

    requiredAttributeNames[attribute[$required]].add(attributeName)

    itemAttributes[attributeName] = freezeAttribute(attribute, attributeName)
  }

  return {
    type: 'item',
    savedAttributeNames,
    keyAttributeNames,
    requiredAttributeNames,
    attributes: itemAttributes
  } as Item<
    { [KEY in keyof $MAP_ATTRIBUTE_ATTRIBUTES]: FreezeAttribute<$MAP_ATTRIBUTE_ATTRIBUTES[KEY]> }
  >
}
