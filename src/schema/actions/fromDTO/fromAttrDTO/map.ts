import type { MapSchema } from '~/attributes/map/index.js'
import { map } from '~/attributes/map/index.js'
import type { AttributeDTO } from '~/schema/actions/dto/index.js'

import { fromAttrDTO } from './attribute.js'

type MapAttrDTO = Extract<AttributeDTO, { type: 'map' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromJSONMapAttr = ({
  keyDefault,
  putDefault,
  updateDefault,
  keyLink,
  putLink,
  updateLink,
  attributes,
  ...props
}: MapAttrDTO): MapSchema => {
  keyDefault
  putDefault
  updateDefault
  keyLink
  putLink
  updateLink

  return map(
    Object.fromEntries(
      Object.entries(attributes).map(([attributeName, attribute]) => [
        attributeName,
        fromAttrDTO(attribute)
      ])
    ),
    props
  )
}
