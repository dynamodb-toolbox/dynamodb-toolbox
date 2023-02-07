import { DynamoDBToolboxError } from 'v1/errors'

import { $Item, FreezeItem } from './interface'
import { FreezeAttribute, freezeAttribute } from './attributes/freeze'
import { RequiredOption } from './attributes/constants/requiredOptions'
import {
  $type,
  $attributes,
  $key,
  $open,
  $savedAs,
  $required
} from './attributes/constants/attributeOptions'

type ItemFreezer = <$ITEM extends $Item>(item: $ITEM) => FreezeItem<$ITEM>

export const freezeItem: ItemFreezer = <$ITEM extends $Item>(item: $ITEM): FreezeItem<$ITEM> => {
  const attributesSavedAs = new Set<string>()

  const keyAttributesNames = new Set<string>()

  const requiredAttributesNames: Record<RequiredOption, Set<string>> = {
    always: new Set(),
    atLeastOnce: new Set(),
    onlyOnce: new Set(),
    never: new Set()
  }

  const attributes: $ITEM[$attributes] = item[$attributes]
  const frozenAttributes: {
    [key in keyof $ITEM[$attributes]]: FreezeAttribute<$ITEM[$attributes][key]>
  } = {} as any

  for (const attributeName in attributes) {
    const attribute = attributes[attributeName]

    const attributeSavedAs = attribute[$savedAs] ?? attributeName
    if (attributesSavedAs.has(attributeSavedAs)) {
      throw new DynamoDBToolboxError('duplicateSavedAsItemAttributes', {
        message: `Invalid item: More than two attributes are saved as '${attributeSavedAs}'`,
        payload: { savedAs: attributeSavedAs }
      })
    }
    attributesSavedAs.add(attributeSavedAs)

    if (attribute[$key]) {
      keyAttributesNames.add(attributeName)
    }
    requiredAttributesNames[attribute[$required]].add(attributeName)

    frozenAttributes[attributeName] = freezeAttribute(attribute, attributeName)
  }

  return {
    type: item[$type],
    open: item[$open],
    keyAttributesNames,
    requiredAttributesNames,
    attributes: frozenAttributes
  }
}
