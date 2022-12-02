import { Item, MapAttribute } from 'v1/item'

export const isOpen = (
  itemOrMapAttribute: Item | MapAttribute
): itemOrMapAttribute is (Item | MapAttribute) & { open: true } => itemOrMapAttribute.open

export const isClosed = (
  itemOrMapAttribute: Item | MapAttribute
): itemOrMapAttribute is (Item | MapAttribute) & { open: false } => !isOpen(itemOrMapAttribute)
