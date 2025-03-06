import type { AnyOfSchema } from '~/schema/anyOf/index.js'

import type { AnyOfSchemaDTO } from '../types.js'
import { getSchemaDTO } from './schema.js'
import { getDefaultsDTO } from './utils.js'

/**
 * @debt feature "handle defaults, links & validators DTOs"
 */
export const getAnyOfSchemaDTO = (schema: AnyOfSchema): AnyOfSchemaDTO => {
  const defaultsDTO = getDefaultsDTO(schema)
  const { required, hidden, key, savedAs } = schema.props

  return {
    type: 'anyOf',
    elements: schema.elements.map(getSchemaDTO) as AnyOfSchemaDTO['elements'],
    ...(required !== undefined && required !== 'atLeastOnce' ? { required } : {}),
    ...(hidden !== undefined && hidden ? { hidden } : {}),
    ...(key !== undefined && key ? { key } : {}),
    ...(savedAs !== undefined ? { savedAs } : {}),
    ...defaultsDTO
  }
}
