import type { SetSchema } from '~/attributes/set/index.js'
import { set } from '~/attributes/set/index.js'
import type { SetElementSchema } from '~/attributes/set/types.js'
import type { AttributeDTO } from '~/schema/actions/dto/index.js'

import { fromSchemaDTO } from './attribute.js'

type SetAttrDTO = Extract<AttributeDTO, { type: 'set' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromSetSchemaDTO = ({
  keyDefault,
  putDefault,
  updateDefault,
  keyLink,
  putLink,
  updateLink,
  elements,
  ...props
}: SetAttrDTO): SetSchema => {
  keyDefault
  putDefault
  updateDefault
  keyLink
  putLink
  updateLink

  return set(fromSchemaDTO(elements) as SetElementSchema, props)
}
