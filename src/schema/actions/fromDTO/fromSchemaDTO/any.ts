import type { ISchemaDTO } from '~/schema/actions/dto/index.js'
import { any } from '~/schema/any/index.js'
import type { AnySchema } from '~/schema/any/index.js'

type AnySchemaDTO = Extract<ISchemaDTO, { type: 'any' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromAnySchemaDTO = ({
  keyDefault,
  putDefault,
  updateDefault,
  keyLink,
  putLink,
  updateLink,
  ...props
}: AnySchemaDTO): AnySchema => {
  keyDefault
  putDefault
  updateDefault
  keyLink
  putLink
  updateLink

  return any(props)
}
