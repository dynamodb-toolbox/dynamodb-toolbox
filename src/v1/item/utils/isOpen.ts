import { FrozenItem, FrozenMapAttribute } from 'v1/item'

export const isOpen = (
  itemOrMapAttribute: FrozenItem | FrozenMapAttribute
): itemOrMapAttribute is (FrozenItem | FrozenMapAttribute) & { open: true } =>
  itemOrMapAttribute.open

export const isClosed = (
  itemOrMapAttribute: FrozenItem | FrozenMapAttribute
): itemOrMapAttribute is (FrozenItem | FrozenMapAttribute) & { open: false } =>
  !isOpen(itemOrMapAttribute)
