import type { ItemSchema } from '~/schema/item/index.js'

import type { ItemSchemaDTO } from '../types.js'
import { getSchemaDTO } from './schema.js'

export const getItemSchemaDTO = (schema: ItemSchema): ItemSchemaDTO => {
  const { strict } = schema.props

  return {
    type: 'item',
    attributes: Object.fromEntries(
      Object.entries(schema.attributes).map(([attributeName, attribute]) => [
        attributeName,
        getSchemaDTO(attribute)
      ])
    ) as ItemSchemaDTO['attributes'],
    ...(strict !== undefined && strict ? { strict } : {})
  }
}
