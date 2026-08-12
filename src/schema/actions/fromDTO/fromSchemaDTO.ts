import type { ItemSchemaDTO } from '~/schema/actions/dto/index.js'
import { item } from '~/schema/item/index.js'
import type { ItemSchema } from '~/schema/item/index.js'

import { fromSchemaDTO as _fromSchemaDTO } from './fromSchemaDTO/index.js'

export const fromSchemaDTO = (schemaDTO: ItemSchemaDTO): ItemSchema => {
  let schema = item(
    Object.fromEntries(
      Object.entries(schemaDTO.attributes).map(([attributeName, attributeDTO]) => [
        attributeName,
        _fromSchemaDTO(attributeDTO)
      ])
    )
  )

  if (schemaDTO.meta !== undefined) {
    schema = schema.meta(schemaDTO.meta)
  }

  return schemaDTO.strict ? schema.strict() : schema
}
