import type { Attribute } from '~/attributes/index.js'

export const isKeyAttribute = (attr: Attribute): boolean => !!attr.state.key
