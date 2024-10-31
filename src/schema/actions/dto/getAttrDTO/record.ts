import type { RecordAttribute } from '~/attributes/record/index.js'
import { RECORD_DEFAULT_OPTIONS } from '~/attributes/record/options.js'
import { isEmpty } from '~/utils/isEmpty.js'

import type { RecordAttrDTO } from '../types.js'
import { getAttrDTO } from './attribute.js'
import { getDefaultsDTO } from './utils.js'

/**
 * @debt feature "handle defaults, links & validators DTOs"
 */
export const getRecordAttrDTO = (attr: RecordAttribute): RecordAttrDTO => {
  const defaultsDTO = getDefaultsDTO(attr)

  return {
    type: 'record',
    keys: getAttrDTO(attr.keys) as RecordAttrDTO['keys'],
    elements: getAttrDTO(attr.elements) as RecordAttrDTO['elements'],
    ...(attr.required !== RECORD_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== RECORD_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== RECORD_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(!isEmpty(defaultsDTO) ? { defaults: defaultsDTO } : {})
  }
}
