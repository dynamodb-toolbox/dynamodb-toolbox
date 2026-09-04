import type { ItemSchema, SchemaMeta } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import { getSchemaDTO } from './getSchemaDTO/index.js'
import type { ItemSchemaDTO } from './types.js'

/**
 * Serialize an item schema into a portable JSON DTO.
 */
export class SchemaDTO<SCHEMA extends ItemSchema = ItemSchema>
  extends SchemaAction<SCHEMA>
  implements ItemSchemaDTO
{
  static override actionName = 'dto' as const

  type: ItemSchemaDTO['type']
  attributes: ItemSchemaDTO['attributes']
  strict?: boolean | undefined
  meta?: SchemaMeta | undefined

  /**
   * Build the DTO from the item schema and its attributes.
   */
  constructor(schema: SCHEMA) {
    super(schema)
    this.type = 'item'
    this.attributes = Object.fromEntries(
      Object.entries(this.schema.attributes).map(([attributeName, attribute]) => [
        attributeName,
        getSchemaDTO(attribute)
      ])
    ) as ItemSchemaDTO['attributes']
    this.strict = schema.props.strict
    this.meta = schema.props.meta
  }

  /**
   * Return the DTO as a plain JSON object.
   */
  toJSON(): ItemSchemaDTO {
    const { strict, meta } = this

    return {
      type: this.type,
      attributes: this.attributes,
      ...(strict !== undefined && strict ? { strict } : {}),
      ...(meta !== undefined ? { meta } : {})
    }
  }
}
