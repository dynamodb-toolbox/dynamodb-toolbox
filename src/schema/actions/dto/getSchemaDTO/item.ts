import type { ItemSchema } from '~/schema/item/index.js'

import type { ItemSchemaDTO } from '../types.js'
import { getSchemaDTO } from './schema.js'

/**
 * Build the DTO of an `item` schema.
 */
export const getItemSchemaDTO = (schema: ItemSchema): ItemSchemaDTO => {
  const { strict, meta } = schema.props

  return {
    type: 'item',
    attributes: Object.fromEntries(
      Object.entries(schema.attributes).map(([attributeName, attribute]) => [
        attributeName,
        getSchemaDTO(attribute)
      ])
    ) as ItemSchemaDTO['attributes'],
    ...(strict !== undefined && strict ? { strict } : {}),
    ...(meta !== undefined ? { meta } : {})
  }
}
