import type { Schema, SchemaProps } from '../types/index.js'

export interface ItemSchemaProps extends SchemaProps {
  strict?: boolean
}

export interface ItemAttributes {
  [key: string]: Schema
}
