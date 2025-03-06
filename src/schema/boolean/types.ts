import type { SchemaProps } from '../types/index.js'

export interface BooleanSchemaProps extends SchemaProps {
  enum?: boolean[]
  transform?: unknown
}
