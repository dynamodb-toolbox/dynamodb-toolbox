import { any } from '~/attributes/any/index.js'
import type { AnySchema } from '~/attributes/any/index.js'
import type { AttributeDTO } from '~/schema/actions/dto/index.js'

type AnyAttrDTO = Extract<AttributeDTO, { type: 'any' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromJSONAnyAttr = ({
  keyDefault,
  putDefault,
  updateDefault,
  keyLink,
  putLink,
  updateLink,
  ...props
}: AnyAttrDTO): AnySchema => {
  keyDefault
  putDefault
  updateDefault
  keyLink
  putLink
  updateLink

  return any(props)
}
