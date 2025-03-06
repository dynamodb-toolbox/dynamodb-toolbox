import type { ISchemaDTO } from '~/schema/actions/dto/index.js'
import type { MapSchema } from '~/schema/map/index.js'
import { map } from '~/schema/map/index.js'

import { fromSchemaDTO } from './attribute.js'

type MapSchemaDTO = Extract<ISchemaDTO, { type: 'map' }>

/**
 * @debt feature "handle defaults, links & validators"
 */
export const fromMapSchemaDTO = ({
  keyDefault,
  putDefault,
  updateDefault,
  keyLink,
  putLink,
  updateLink,
  attributes,
  ...props
}: MapSchemaDTO): MapSchema => {
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
        fromSchemaDTO(attribute)
      ])
    ),
    props
  )
}
