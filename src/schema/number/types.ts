import type { SchemaProps } from '../types/index.js'

export interface NumberSchemaProps extends SchemaProps {
  big?: boolean
  enum?: (number | bigint)[]
  transform?: unknown
}
