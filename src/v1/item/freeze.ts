import { _Item, FreezeItem } from './interface'
import { FreezeAttribute, freezeAttribute } from './attributes/freeze'
import { RequiredOption } from './attributes/constants/requiredOptions'

type ItemFreezer = <_ITEM extends _Item>(item: _ITEM) => FreezeItem<_ITEM>

export const freezeItem: ItemFreezer = <_ITEM extends _Item>(item: _ITEM): FreezeItem<_ITEM> => {
  const { _type: type, _open: open } = item

  const attributesSavedAs = new Set<string>()

  const requiredAttributesNames: Record<RequiredOption, Set<string>> = {
    always: new Set(),
    atLeastOnce: new Set(),
    onlyOnce: new Set(),
    never: new Set()
  }

  const attributes: _ITEM['_attributes'] = item._attributes
  const frozenAttributes: {
    [key in keyof _ITEM['_attributes']]: FreezeAttribute<_ITEM['_attributes'][key]>
  } = {} as any

  for (const attributeName in attributes) {
    const attribute = attributes[attributeName]

    const attributeSavedAs = attribute._savedAs ?? attributeName
    if (attributesSavedAs.has(attributeSavedAs)) {
      throw new DuplicateSavedAsAttributesError({ duplicatedSavedAs: attributeSavedAs })
    }
    attributesSavedAs.add(attributeSavedAs)

    requiredAttributesNames[attribute._required].add(attributeName)

    frozenAttributes[attributeName] = freezeAttribute(attribute, attributeName)
  }

  return {
    type,
    open,
    requiredAttributesNames,
    attributes: frozenAttributes
  }
}

export class DuplicateSavedAsAttributesError extends Error {
  constructor({ duplicatedSavedAs }: { duplicatedSavedAs: string }) {
    super(`Invalid item: More than two attributes are saved as '${duplicatedSavedAs}'`)
  }
}
