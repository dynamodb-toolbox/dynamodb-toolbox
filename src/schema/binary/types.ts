import type { SchemaProps } from '../types/index.js'

/**
 * Props accepted by a binary schema.
 */
export interface BinarySchemaProps extends SchemaProps {
  enum?: Uint8Array[]
  transform?: unknown
}
