import type { SchemaProps } from '../shared/props.js'

export interface BinarySchemaProps extends SchemaProps {
  enum?: Uint8Array[]
  transform?: unknown
}
