import type { SchemaProps } from '../shared/props.js'

export interface NullSchemaProps extends SchemaProps {
  enum?: null[]
  transform?: unknown
}
