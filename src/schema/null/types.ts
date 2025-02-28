import type { SchemaProps } from '../types/index.js'

export interface NullSchemaProps extends SchemaProps {
  enum?: null[]
  transform?: unknown
}
