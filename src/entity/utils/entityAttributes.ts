import type { Schema, SchemaRequiredProp } from '~/attributes/index.js'

export interface EntityAttributes {
  [KEY: string]: Schema
}

export interface SchemaOf<ATTRIBUTES extends EntityAttributes> {
  attributes: ATTRIBUTES

  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<SchemaRequiredProp, Set<string>>
}
