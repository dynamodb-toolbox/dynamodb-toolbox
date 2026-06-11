import type { TupleSchema } from '~/schema/tuple/index.js'

import type { TupleSchemaDTO } from '../types.js'
import { getSchemaDTO } from './schema.js'
import { getDefaultsDTO } from './utils.js'

/**
 * @debt feature "handle defaults, links & validators DTOs"
 */
export const getTupleSchemaDTO = (schema: TupleSchema): TupleSchemaDTO => {
  const defaultsDTO = getDefaultsDTO(schema)
  const { required, hidden, key, savedAs } = schema.props

  return {
    type: 'tuple',
    elements: schema.elements.map(getSchemaDTO) as TupleSchemaDTO['elements'],
    ...(required !== undefined && required !== 'atLeastOnce' ? { required } : {}),
    ...(hidden !== undefined && hidden ? { hidden } : {}),
    ...(key !== undefined && key ? { key } : {}),
    ...(savedAs !== undefined ? { savedAs } : {}),
    ...defaultsDTO
  }
}
