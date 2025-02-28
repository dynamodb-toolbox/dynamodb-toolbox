import type { AttrSchema } from '~/attributes/index.js'

export const isKeyAttribute = (schema: AttrSchema): boolean => !!schema.props.key
