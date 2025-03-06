import type { SchemaProps } from '../types/index.js'

export interface StringSchemaProps extends SchemaProps {
  enum?: string[]
  transform?: unknown
}
