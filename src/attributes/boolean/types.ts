import type { SchemaProps } from '../shared/props.js'

export interface BooleanSchemaProps extends SchemaProps {
  enum?: boolean[]
  transform?: unknown
}
