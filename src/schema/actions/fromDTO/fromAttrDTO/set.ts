import type { $SetAttributeNestedState } from '~/attributes/set/index.js'
import { set } from '~/attributes/set/index.js'
import type { $SetAttributeElements } from '~/attributes/set/types.js'
import type { AttributeDTO } from '~/schema/actions/dto/index.js'

import { fromAttrDTO } from './attribute.js'

type SetAttrDTO = Extract<AttributeDTO, { type: 'set' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromJSONSetAttr = ({
  keyDefault,
  putDefault,
  updateDefault,
  keyLink,
  putLink,
  updateLink,
  elements,
  ...props
}: SetAttrDTO): $SetAttributeNestedState => {
  keyDefault
  putDefault
  updateDefault
  keyLink
  putLink
  updateLink

  return set(fromAttrDTO(elements) as $SetAttributeElements, props)
}
