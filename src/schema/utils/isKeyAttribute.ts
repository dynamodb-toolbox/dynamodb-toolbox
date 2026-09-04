import type { Schema } from '~/schema/index.js'

/**
 * Whether a schema is part of the primary key.
 */
export const isKeyAttribute = (schema: Schema): boolean => !!schema.props.key
