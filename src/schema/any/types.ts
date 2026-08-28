import type { SchemaProps } from '../types/index.js'

/**
 * Props accepted by an `any` schema.
 */
export interface AnySchemaProps extends SchemaProps {
  castAs?: unknown
  transform?: undefined | unknown
}
