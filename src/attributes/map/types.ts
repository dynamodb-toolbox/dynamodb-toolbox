import type { AttrSchema, Attribute } from '../types/index.js'

export interface MapAttributesSchemas {
  [key: string]: AttrSchema
}

/**
 * @deprecated
 */
export interface MapAttributeAttributes {
  [key: string]: Attribute
}
