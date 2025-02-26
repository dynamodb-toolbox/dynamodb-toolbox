import type { AnySchema } from '~/attributes/any/index.js'

import type { AnyAttrDTO, AnyAttrTransformerDTO } from '../types.js'
import { getDefaultsDTO, isTransformerWithDTO } from './utils.js'

/**
 * @debt feature "handle defaults, links & validators DTOs"
 */
export const getAnyAttrDTO = (attr: AnySchema): AnyAttrDTO => {
  const defaultsDTO = getDefaultsDTO(attr)
  const { required, hidden, key, savedAs, transform } = attr.props

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
            : { transformerId: 'custom' }) as AnyAttrTransformerDTO
        }
      : {}),
    ...defaultsDTO
  }
}
