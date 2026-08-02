import type { Schema, SchemaProps } from '../types/index.js'

export interface MapSchemaProps extends SchemaProps {
  strict?: boolean
}

export interface MapAttributes {
  [key: string]: Schema
}
