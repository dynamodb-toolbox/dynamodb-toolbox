import type { SchemaProps } from '../shared/props.js'

export interface StringSchemaProps extends SchemaProps {
  enum?: string[]
  transform?: unknown
}
