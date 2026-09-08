import type { ItemSchemaProps, Schema, SchemaRequiredProp } from '~/schema/index.js'

/** Map of attribute names to their schemas. */
export interface EntityAttributes {
  [KEY: string]: Schema
}

/** Item schema shape an `Entity` is built from. */
export interface SchemaOf<ATTRIBUTES extends EntityAttributes> {
  attributes: ATTRIBUTES
  props: ItemSchemaProps
  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<SchemaRequiredProp, Set<string>>
}
