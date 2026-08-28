import type { Schema, SchemaProps } from '../types/index.js'

/**
 * Props accepted by an item schema.
 */
export interface ItemSchemaProps extends SchemaProps {
  strict?: boolean
}

/**
 * Named attributes of an item schema.
 */
export interface ItemAttributes {
  [key: string]: Schema
}
