import type { ItemSchema } from '~/attributes/item/index.js'
import { item } from '~/attributes/item/index.js'
import type { AttributeDTO } from '~/schema/actions/dto/index.js'

import { fromSchemaDTO } from './attribute.js'

type ItemAttrDTO = Extract<AttributeDTO, { type: 'item' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromItemSchemaDTO = ({
  keyDefault,
  putDefault,
  updateDefault,
  keyLink,
  putLink,
  updateLink,
  attributes
}: ItemAttrDTO): ItemSchema => {
  keyDefault
  putDefault
  updateDefault
  keyLink
  putLink
  updateLink

  return item(
    Object.fromEntries(
      Object.entries(attributes).map(([attributeName, attribute]) => [
        attributeName,
        fromSchemaDTO(attribute)
      ])
    )
  )
}
