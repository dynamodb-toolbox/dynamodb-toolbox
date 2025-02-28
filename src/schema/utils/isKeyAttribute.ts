import type { Schema } from '~/attributes/index.js'

export const isKeyAttribute = (schema: Schema): boolean => !!schema.props.key
