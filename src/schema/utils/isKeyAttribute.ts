import type { AttrSchema } from '~/attributes/index.js'

export const isKeyAttribute = (attr: AttrSchema): boolean => !!attr.state.key
