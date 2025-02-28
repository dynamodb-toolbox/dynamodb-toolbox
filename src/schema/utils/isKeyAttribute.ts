import type { Schema } from '~/schema/index.js'

export const isKeyAttribute = (schema: Schema): boolean => !!schema.props.key
