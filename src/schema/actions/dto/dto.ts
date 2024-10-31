import { SchemaAction } from '~/schema/index.js'
import type { Schema } from '~/schema/index.js'

import { getAttrDTO } from './getAttrDTO/index.js'
import type { ISchemaDTO } from './types.js'

export class SchemaDTO<SCHEMA extends Schema = Schema>
  extends SchemaAction<SCHEMA>
  implements ISchemaDTO
{
  static actionName = 'dto' as const
  type: ISchemaDTO['type']
  attributes: ISchemaDTO['attributes']

  constructor(schema: SCHEMA) {
    super(schema)
    this.type = 'schema'
    this.attributes = Object.fromEntries(
      Object.entries(this.schema.attributes).map(([attributeName, attribute]) => [
        attributeName,
        getAttrDTO(attribute)
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
