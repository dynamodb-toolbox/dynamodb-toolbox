import type { SchemaProps } from '../types/index.js'

export interface BinarySchemaProps extends SchemaProps {
  enum?: Uint8Array[]
  transform?: unknown
}
