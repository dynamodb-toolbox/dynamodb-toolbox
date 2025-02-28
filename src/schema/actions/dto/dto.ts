import type { ItemSchema } from '~/attributes/index.js'
import { SchemaAction } from '~/schema/index.js'

import { getSchemaDTO } from './getSchemaDTO/index.js'
import type { ISchemaDTO, ItemSchemaDTO } from './types.js'

export class SchemaDTO<SCHEMA extends ItemSchema = ItemSchema>
  extends SchemaAction<SCHEMA>
  implements ItemSchemaDTO
{
  static actionName = 'dto' as const
  type: ItemSchemaDTO['type']
  attributes: ItemSchemaDTO['attributes']

  constructor(schema: SCHEMA) {
    super(schema)
    this.type = 'item'
    this.attributes = Object.fromEntries(
      Object.entries(this.schema.attributes).map(([attributeName, attribute]) => [
        attributeName,
        getSchemaDTO(attribute)
      ])
    )
  }

  toJSON(): ISchemaDTO {
    return {
      type: this.type,
      attributes: this.attributes
    }
  }
}
