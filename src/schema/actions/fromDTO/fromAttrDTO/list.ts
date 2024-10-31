import type { $ListAttributeNestedState } from '~/attributes/list/index.js'
import { list } from '~/attributes/list/index.js'
import type { $ListAttributeElements } from '~/attributes/list/types.js'
import type { AttributeDTO } from '~/schema/actions/dto/index.js'

import { fromAttrDTO } from './attribute.js'

type ListAttrDTO = Extract<AttributeDTO, { type: 'list' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromListAttrDTO = ({
  defaults,
  links,
  elements,
  ...props
}: ListAttrDTO): $ListAttributeNestedState => {
  defaults
  links

  return list(fromAttrDTO(elements) as $ListAttributeElements, props)
}
