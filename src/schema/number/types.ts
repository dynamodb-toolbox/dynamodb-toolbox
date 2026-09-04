import type { SchemaProps } from '../types/index.js'

/**
 * Props accepted by a number schema.
 */
export interface NumberSchemaProps extends SchemaProps {
  big?: boolean
  enum?: (number | bigint)[]
  transform?: unknown
}
