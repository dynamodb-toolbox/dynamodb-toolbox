import type { RecordSchema } from '~/attributes/record/index.js'

import type { RecordAttrDTO } from '../types.js'
import { getAttrDTO } from './attribute.js'
import { getDefaultsDTO } from './utils.js'

/**
 * @debt feature "handle defaults, links & validators DTOs"
 */
export const getRecordAttrDTO = (attr: RecordSchema): RecordAttrDTO => {
  const defaultsDTO = getDefaultsDTO(attr)
  const { required, hidden, key, savedAs } = attr.props

  return {
    type: 'record',
    keys: getAttrDTO(attr.keys) as RecordAttrDTO['keys'],
    elements: getAttrDTO(attr.elements) as RecordAttrDTO['elements'],
    ...(required !== undefined && required !== 'atLeastOnce' ? { required } : {}),
    ...(hidden !== undefined && hidden ? { hidden } : {}),
    ...(key !== undefined && key ? { key } : {}),
    ...(savedAs !== undefined ? { savedAs } : {}),
    ...defaultsDTO
  }
}
