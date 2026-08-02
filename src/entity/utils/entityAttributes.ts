import type { ItemSchemaProps, Schema, SchemaRequiredProp } from '~/schema/index.js'

export interface EntityAttributes {
  [KEY: string]: Schema
}

export interface SchemaOf<ATTRIBUTES extends EntityAttributes> {
  attributes: ATTRIBUTES
  props: ItemSchemaProps
  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<SchemaRequiredProp, Set<string>>
}
