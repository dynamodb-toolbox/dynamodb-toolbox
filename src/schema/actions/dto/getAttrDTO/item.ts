import type { ItemSchema } from '~/attributes/item/index.js'

import type { ItemSchemaDTO } from '../types.js'
import { getAttrDTO } from './attribute.js'

export const getItemSchemaDTO = (attr: ItemSchema): ItemSchemaDTO => ({
  type: 'item',
  attributes: Object.fromEntries(
    Object.entries(attr.attributes).map(([attributeName, attribute]) => [
      attributeName,
      getAttrDTO(attribute)
    ])
  )
})
