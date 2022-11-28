import { _Item, FreezeItem } from './interface'
import { FreezeAttribute, freezeAttribute } from './attributes/freeze'
import { RequiredOption } from './attributes/constants/requiredOptions'

type ItemFreezer = <ItemInput extends _Item>(item: ItemInput) => FreezeItem<ItemInput>

export const freezeItem: ItemFreezer = <ItemInput extends _Item>(
  item: ItemInput
): FreezeItem<ItemInput> => {
  const { _type: type, _open: open } = item

  const attributesSavedAs = new Set<string>()

  const requiredAttributesNames: Record<RequiredOption, Set<string>> = {
    always: new Set(),
    atLeastOnce: new Set(),
    onlyOnce: new Set(),
    never: new Set()
  }

  const attributes: ItemInput['_attributes'] = item._attributes
  const frozenAttributes: {
    [key in keyof ItemInput['_attributes']]: FreezeAttribute<ItemInput['_attributes'][key]>
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
