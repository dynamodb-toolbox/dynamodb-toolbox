import type { SchemaProps } from '../shared/props.js'

export interface AnySchemaProps extends SchemaProps {
  castAs?: unknown
  transform?: undefined | unknown
}
