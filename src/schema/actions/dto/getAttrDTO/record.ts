import type { RecordAttribute } from '~/attributes/record/index.js'
import { RECORD_DEFAULT_OPTIONS } from '~/attributes/record/options.js'
import { isEmpty } from '~/utils/isEmpty.js'

import type { IAttributeDTO } from '../schema/index.js'
import { getAttrDTO } from './attribute.js'
import { getDefaultsDTO } from './utils.js'

/**
 * @debt feature "handle JSONizable defaults, links & validators"
 */
export const getRecordAttrDTO = (attr: RecordAttribute): IAttributeDTO => {
  const defaultsDTO = getDefaultsDTO(attr)

  return {
    type: 'record',
    keys: getAttrDTO(attr.keys),
    elements: getAttrDTO(attr.elements),
    ...(attr.required !== RECORD_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== RECORD_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== RECORD_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(!isEmpty(defaultsDTO) ? { defaults: defaultsDTO } : {})
    // We need to cast as `IAttributeDTO` is not assignable to record keys
  } as Extract<IAttributeDTO, { type: 'record' }>
}
