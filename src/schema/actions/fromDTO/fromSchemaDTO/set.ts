import type { ISchemaDTO } from '~/schema/actions/dto/index.js'
import type { SetSchema } from '~/schema/set/index.js'
import { set } from '~/schema/set/index.js'
import type { SetElementSchema } from '~/schema/set/types.js'

import { fromSchemaDTO } from './attribute.js'

type SetSchemaDTO = Extract<ISchemaDTO, { type: 'set' }>

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
}: SetSchemaDTO): SetSchema => {
  keyDefault
  putDefault
  updateDefault
  keyLink
  putLink
  updateLink

  return set(fromSchemaDTO(elements) as SetElementSchema, props)
}
