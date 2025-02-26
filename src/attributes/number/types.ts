import type { SchemaProps } from '../shared/props.js'

export interface NumberSchemaProps extends SchemaProps {
  big?: boolean
  enum?: (number | bigint)[]
  transform?: unknown
}
