import type { SchemaProps } from '../types/index.js'

export interface AnySchemaProps extends SchemaProps {
  castAs?: unknown
  transform?: undefined | unknown
}
