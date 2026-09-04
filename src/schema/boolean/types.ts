import type { SchemaProps } from '../types/index.js'

/**
 * Props accepted by a boolean schema.
 */
export interface BooleanSchemaProps extends SchemaProps {
  enum?: boolean[]
  transform?: unknown
}
