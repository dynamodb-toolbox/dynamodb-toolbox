import type { Schema, SchemaProps } from '../types/index.js'

/**
 * Props accepted by a map schema.
 */
export interface MapSchemaProps extends SchemaProps {
  strict?: boolean
}

/**
 * Named attributes of a map schema.
 */
export interface MapAttributes {
  [key: string]: Schema
}
