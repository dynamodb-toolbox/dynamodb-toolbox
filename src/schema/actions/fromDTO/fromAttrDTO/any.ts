import { any } from '~/attributes/any/index.js'
import type { $AnyAttributeNestedState } from '~/attributes/any/index.js'
import type { AttributeDTO } from '~/schema/actions/dto/index.js'

type AnyAttrDTO = Extract<AttributeDTO, { type: 'any' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromJSONAnyAttr = ({
  defaults,
  links,
  ...props
}: AnyAttrDTO): $AnyAttributeNestedState => {
  defaults
  links

  return any(props)
}
