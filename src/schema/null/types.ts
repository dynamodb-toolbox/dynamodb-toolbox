import type { SchemaProps } from '../types/index.js'

/**
 * Props accepted by a null schema.
 */
export interface NullSchemaProps extends SchemaProps {
  enum?: null[]
  transform?: unknown
}
