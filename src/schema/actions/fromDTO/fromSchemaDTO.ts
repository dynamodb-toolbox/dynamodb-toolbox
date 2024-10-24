import type { ISchemaDTO } from '~/schema/actions/dto/index.js'
import type { Schema } from '~/schema/index.js'
import { schema } from '~/schema/index.js'

import { fromAttrDTO } from './fromAttrDTO/index.js'

export const fromSchemaDTO = (schemaDTO: ISchemaDTO): Schema =>
  schema(
    Object.fromEntries(
      Object.entries(schemaDTO.attributes).map(([attributeName, attributeDTO]) => [
        attributeName,
        fromAttrDTO(attributeDTO)
      ])
    )
  )
