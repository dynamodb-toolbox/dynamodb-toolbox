import type { ItemSchema } from '~/attributes/item/index.js'

import type { ItemSchemaDTO } from '../types.js'
import { getSchemaDTO } from './schema.js'

export const getItemSchemaDTO = (schema: ItemSchema): ItemSchemaDTO => ({
  type: 'item',
  attributes: Object.fromEntries(
    Object.entries(schema.attributes).map(([attributeName, attribute]) => [
      attributeName,
      getSchemaDTO(attribute)
    ])
  )
})
