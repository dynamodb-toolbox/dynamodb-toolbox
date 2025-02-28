import type { ISchemaDTO } from '~/schema/actions/dto/index.js'
import type { ListSchema } from '~/schema/list/index.js'
import { list } from '~/schema/list/index.js'
import type { ListElementSchema } from '~/schema/list/types.js'

import { fromSchemaDTO } from './attribute.js'

type ListSchemaDTO = Extract<ISchemaDTO, { type: 'list' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromListSchemaDTO = ({
  keyDefault,
  putDefault,
  updateDefault,
  keyLink,
  putLink,
  updateLink,
  elements,
  ...props
}: ListSchemaDTO): ListSchema => {
  keyDefault
  putDefault
  updateDefault
  keyLink
  putLink
  updateLink

  return list(fromSchemaDTO(elements) as ListElementSchema, props)
}
