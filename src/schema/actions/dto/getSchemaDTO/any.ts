import type { AnySchema } from '~/attributes/any/index.js'

import type { AnySchemaDTO, AnyTransformerDTO } from '../types.js'
import { getDefaultsDTO, isTransformerWithDTO } from './utils.js'

/**
 * @debt feature "handle defaults, links & validators DTOs"
 */
export const getAnySchemaDTO = (schema: AnySchema): AnySchemaDTO => {
  const defaultsDTO = getDefaultsDTO(schema)
  const { required, hidden, key, savedAs, transform } = schema.props

  return {
    type: 'any',
    ...(required !== undefined && required !== 'atLeastOnce' ? { required } : {}),
    ...(hidden !== undefined && hidden ? { hidden } : {}),
    ...(key !== undefined && key ? { key } : {}),
    ...(savedAs !== undefined ? { savedAs } : {}),
    ...(transform !== undefined
      ? {
          transform: (isTransformerWithDTO(transform)
            ? transform.toJSON()
            : { transformerId: 'custom' }) as AnyTransformerDTO
        }
      : {}),
    ...defaultsDTO
  }
}
