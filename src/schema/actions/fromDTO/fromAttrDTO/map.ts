import type { $MapAttributeNestedState } from '~/attributes/map/index.js'
import { map } from '~/attributes/map/index.js'
import type { IAttributeDTO } from '~/schema/actions/dto/index.js'

import { fromAttrDTO } from './attribute.js'

type MapAttrDTO = Extract<IAttributeDTO, { type: 'map' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromJSONMapAttr = ({
  defaults,
  links,
  attributes,
  ...props
}: MapAttrDTO): $MapAttributeNestedState => {
  defaults
  links

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
