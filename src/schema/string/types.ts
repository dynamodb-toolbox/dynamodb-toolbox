import type { SchemaProps } from '../types/index.js'

/**
 * Props accepted by a string schema.
 */
export interface StringSchemaProps extends SchemaProps {
  enum?: string[]
  transform?: unknown
}
